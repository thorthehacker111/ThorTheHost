"""
Centralized logging configuration.

Keeping logging setup in one place avoids every module reinventing its own
``logging.basicConfig`` call (which, in practice, causes duplicated log
lines and inconsistent formats once a project grows).
"""

import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """Configure the root logger once, at application startup."""
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(stream=sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Avoid attaching duplicate handlers if configure_logging() is called
    # more than once (e.g. under the reloader).
    if not root_logger.handlers:
        root_logger.addHandler(handler)

    # Uvicorn's own loggers should follow the same format/level.
    for uvicorn_logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logging.getLogger(uvicorn_logger_name).handlers = [handler]
        logging.getLogger(uvicorn_logger_name).setLevel(log_level)


def get_logger(name: str) -> logging.Logger:
    """Return a module-scoped logger, e.g. ``get_logger(__name__)``."""
    return logging.getLogger(name)
