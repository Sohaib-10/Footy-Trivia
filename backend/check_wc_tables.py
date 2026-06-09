"""Check World Cup prediction tables in the database."""
import asyncio

from sqlalchemy import text

from app.database import async_session

TABLES = ("wc_user_predictions", "wc_leaderboard", "wc_results")

# Whitelist-only table names — never interpolate user input into SQL.
_COUNT_QUERIES = {
    "wc_user_predictions": text("SELECT COUNT(*) FROM wc_user_predictions"),
    "wc_leaderboard": text("SELECT COUNT(*) FROM wc_leaderboard"),
    "wc_results": text("SELECT COUNT(*) FROM wc_results"),
}


async def main() -> None:
    async with async_session() as session:
        for table in TABLES:
            try:
                result = await session.execute(_COUNT_QUERIES[table])
                print(f"{table}: exists, rows={result.scalar()}")
            except Exception as exc:
                print(f"{table}: MISSING or error — {exc}")


if __name__ == "__main__":
    asyncio.run(main())
