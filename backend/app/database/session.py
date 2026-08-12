"""
Database engine and session management.

This module owns the SQLAlchemy ``Engine`` and ``sessionmaker``. Nothing
outside of ``app/database`` and ``app/models`` should talk to SQLAlchemy
directly -- the repository layer (Phase 2+) is the only consumer of
``get_db``. This keeps the ORM an implementation detail rather than
something leaking into API routes or business logic.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# ``pool_pre_ping`` protects against stale connections after PostgreSQL
# (or the OS) closes an idle connection -- common on local dev machines
# that sleep/hibernate.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    future=True,
)


class Base(DeclarativeBase):
    """Shared declarative base for every ORM model in the project."""

    pass


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session per request.

    The session is always closed after the request finishes, even if an
    exception is raised, preventing connection leaks under load.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
