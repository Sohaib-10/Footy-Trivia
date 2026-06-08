import ssl
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
from app.config import settings

# In case DATABASE_URL is standard postgresql://, convert to postgresql+asyncpg://
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)


def _remote_connect_args() -> dict:
    # Remote managed Postgres (e.g. Supabase) requires SSL. We encrypt the
    # connection but skip cert verification, which avoids local CA/trust-store
    # issues while still using TLS. Disabling the prepared-statement cache keeps
    # asyncpg compatible with transaction-mode poolers (Supabase).
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return {"ssl": ctx, "statement_cache_size": 0}


_is_local = "localhost" in db_url or "127.0.0.1" in db_url
connect_args = {} if _is_local else _remote_connect_args()

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args=connect_args
)

async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
