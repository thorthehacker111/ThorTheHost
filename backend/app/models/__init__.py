"""
Expose all models here so Alembic can discover them in `env.py`.
"""

from app.models.user import User
from app.models.alias import Alias
from app.models.token import VerificationToken, PasswordResetToken
from app.models.log import EmailLog, AuditLog
from app.models.otp import OTPCode

__all__ = [
    "User",
    "Alias",
    "VerificationToken",
    "PasswordResetToken",
    "EmailLog",
    "AuditLog",
    "OTPCode",
]
