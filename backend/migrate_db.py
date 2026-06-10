"""Copy all data from the local Postgres DB into a target DB (e.g. Supabase).

Usage (PowerShell):
    cd backend
    $env:SOURCE_DATABASE_URL = "<your-source-database-url>"
    $env:TARGET_DATABASE_URL = "<your-target-database-url>"
    python migrate_db.py

The script creates the schema on the target (if missing), copies every table in
foreign-key dependency order, and resets integer primary-key sequences.
"""
import asyncio
import os
import ssl
import sys
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import create_async_engine

from app.database import Base
from app import models  # noqa: F401  (registers all tables on Base.metadata)

def _normalize(url: str) -> str:
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


def _connect_args(url: str) -> dict:
    is_local = "localhost" in url or "127.0.0.1" in url
    if is_local:
        return {}
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return {"ssl": ctx, "statement_cache_size": 0}


def _clean_row(row: dict) -> dict:
    # Target columns are TIMESTAMP WITHOUT TIME ZONE; convert any tz-aware
    # datetimes to naive UTC so asyncpg can bind them.
    for key, value in row.items():
        if isinstance(value, datetime) and value.tzinfo is not None:
            row[key] = value.astimezone(timezone.utc).replace(tzinfo=None)
    return row


async def migrate(source_url: str, target_url: str) -> None:
    source_engine = create_async_engine(source_url, connect_args=_connect_args(source_url))
    target_engine = create_async_engine(target_url, connect_args=_connect_args(target_url))

    # 1. Create schema on the target.
    async with target_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Schema ensured on target.")

    tables = list(Base.metadata.sorted_tables)

    for table in tables:
        async with source_engine.connect() as src:
            rows = [_clean_row(dict(r)) for r in (await src.execute(select(table))).mappings().all()]

        if not rows:
            print(f"  {table.name}: 0 rows (skipped)")
            continue

        async with target_engine.begin() as dst:
            # Skip rows that already exist (idempotent re-runs).
            existing = (await dst.execute(select(func.count()).select_from(table))).scalar() or 0
            if existing:
                print(f"  {table.name}: target already has {existing} rows (skipped)")
                continue
            await dst.execute(table.insert(), rows)
        print(f"  {table.name}: copied {len(rows)} rows")

    # 2. Reset integer PK sequences so new inserts don't collide.
    async with target_engine.begin() as dst:
        for table in tables:
            pk_cols = [c for c in table.primary_key.columns]
            if len(pk_cols) == 1 and str(pk_cols[0].type).upper().startswith(("INTEGER", "SMALLINT", "BIGINT")):
                col = pk_cols[0].name
                try:
                    await dst.exec_driver_sql(
                        f"SELECT setval(pg_get_serial_sequence('{table.name}', '{col}'), "
                        f"COALESCE((SELECT MAX({col}) FROM {table.name}), 1))"
                    )
                except Exception as exc:  # noqa: BLE001
                    print(f"  (sequence reset skipped for {table.name}: {exc})")

    await source_engine.dispose()
    await target_engine.dispose()
    print("Migration complete.")


def main() -> int:
    source_raw = os.environ.get("SOURCE_DATABASE_URL", "").strip()
    target_raw = os.environ.get("TARGET_DATABASE_URL", "").strip()
    if not source_raw:
        print("ERROR: set SOURCE_DATABASE_URL to your source database connection string.")
        return 1
    if not target_raw:
        print("ERROR: set TARGET_DATABASE_URL to your target database connection string.")
        return 1
    source = _normalize(source_raw)
    target = _normalize(target_raw)
    print(f"Source: {source.split('@')[-1]}")
    print(f"Target: {target.split('@')[-1]}")
    asyncio.run(migrate(source, target))
    return 0


if __name__ == "__main__":
    sys.exit(main())
