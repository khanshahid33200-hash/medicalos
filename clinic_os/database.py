"""Database connection and session management"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from clinic_os.config import settings
import logging

logger = logging.getLogger(__name__)

# Engine kwargs based on DB type
engine_kwargs = {
    "echo": settings.debug,
}

if "sqlite" not in settings.database_url:
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 5,
        "pool_pre_ping": True,
    })

# Create async engine
engine = create_async_engine(
    settings.database_url,
    **engine_kwargs
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# Base class for all ORM models
Base = declarative_base()


async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Initialize database (create tables)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized")


async def close_db():
    """Close database connections"""
    await engine.dispose()
    logger.info("Database connections closed")
