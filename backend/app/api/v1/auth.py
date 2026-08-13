import logging
import random
from datetime import datetime, timedelta
from typing import Any
import httpx

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.database.session import get_db
from app.models.otp import OTPCode
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()
logger = logging.getLogger(__name__)

OTP_EXPIRE_MINUTES = 10


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _generate_otp() -> str:
    """Generate a cryptographically adequate 6-digit OTP."""
    return f"{random.SystemRandom().randint(0, 999999):06d}"


def _send_otp_email(to_email: str, otp: str, username: str) -> None:
    """Send the OTP code via the SendGrid HTTPS API.

    Uses HTTPS (443) instead of SMTP (587) because Render's free tier
    blocks outbound traffic to SMTP ports.
    """
    payload = {
        "personalizations": [{"to": [{"email": to_email}]}],
        "from": {"email": settings.smtp_from_email, "name": "ThorTheHost"},
        "subject": "ThorTheHost — Your Verification Code",
        "content": [
            {
                "type": "text/plain",
                "value": (
                    f"Hi {username},\n\n"
                    f"Your ThorTheHost verification code is:\n\n"
                    f"  {otp}\n\n"
                    f"This code expires in {OTP_EXPIRE_MINUTES} minutes.\n"
                    f"If you did not request this, you can safely ignore this email.\n\n"
                    f"— The ThorTheHost Team"
                ),
            }
        ],
    }
    try:
        response = httpx.post(
            "https://api.sendgrid.com/v3/mail/send",
            json=payload,
            headers={
                "Authorization": f"Bearer {settings.smtp_password}",
                "Content-Type": "application/json",
            },
            timeout=10.0,
        )
        response.raise_for_status()
        logger.info("OTP email sent to %s (status %s)", to_email, response.status_code)
    except httpx.HTTPStatusError as exc:
        logger.error(
            "SendGrid rejected OTP email to %s: %s — %s",
            to_email, exc.response.status_code, exc.response.text,
        )
        raise
    except Exception as exc:
        logger.error("Failed to send OTP email to %s: %s", to_email, exc)
        raise

def _create_and_send_otp(user: User, db: Session) -> None:
    """Invalidate old OTPs, create a new one, and email it."""
    # Invalidate any existing active OTPs for this user
    db.query(OTPCode).filter(
        OTPCode.user_id == user.id,
        OTPCode.used == False,  # noqa: E712
        OTPCode.purpose == "forward_verification",
    ).update({"used": True})
    db.commit()

    code = _generate_otp()
    otp = OTPCode(
        user_id=user.id,
        code=code,
        purpose="forward_verification",
        expires_at=datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES),
    )
    db.add(otp)
    db.commit()

    _send_otp_email(user.forward_email, code, user.username)


# ---------------------------------------------------------------------------
# Schemas for OTP endpoints
# ---------------------------------------------------------------------------

class OTPVerifyRequest(BaseModel):
    code: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Register a new user.
    The forward_email is also stored as the login email.
    After creation an OTP is sent to forward_email for verification.
    """
    # Use forward_email as the account email (single email strategy)
    user_by_email = db.query(User).filter(User.email == user_in.forward_email).first()
    if user_by_email:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists.",
        )
    user_by_username = db.query(User).filter(User.username == user_in.username).first()
    if user_by_username:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )

    user = User(
        username=user_in.username,
        email=user_in.forward_email,          # email = forward_email
        forward_email=user_in.forward_email,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Send OTP — best-effort (don't fail registration if SMTP is misconfigured)
    try:
        _create_and_send_otp(user, db)
    except Exception:
        logger.warning("OTP send failed for user %s — they can resend from settings.", user.username)

    # Trigger Cloudflare destination verification
    from app.services.cloudflare_service import cloudflare_email
    try:
        import asyncio
        # We need to run the async method in a sync context since FastAPI endpoint here is sync `def`
        loop = asyncio.new_event_loop()
        loop.run_until_complete(cloudflare_email.add_destination_address(user.forward_email))
        loop.close()
    except Exception as e:
        logger.warning("Failed to add Cloudflare destination address for %s: %s", user.forward_email, e)

    return user


@router.post("/login", response_model=Token)
def login(
    response: Response, login_data: LoginRequest, db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login — get an access token and HttpOnly cookie.
    """
    user = db.query(User).filter(
        (User.email == login_data.login) | (User.username == login_data.login)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email/username or password")
    elif user.status != "active":
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.jwt_access_token_expire_minutes)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.cookie_secure,
        domain=settings.cookie_domain if settings.cookie_domain else None,
        samesite="lax",
        max_age=settings.jwt_access_token_expire_minutes * 60,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response) -> Any:
    """Clear the HttpOnly cookie to log out."""
    response.delete_cookie(
        key="access_token",
        secure=settings.cookie_secure,
        domain=settings.cookie_domain if settings.cookie_domain else None,
        samesite="lax",
    )
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get current user."""
    return current_user


@router.post("/verify-otp", status_code=status.HTTP_200_OK)
def verify_otp(
    body: OTPVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Verify the 6-digit OTP sent to the user's forwarding email.
    On success, marks is_forward_verified = True.
    """
    otp = db.query(OTPCode).filter(
        OTPCode.user_id == current_user.id,
        OTPCode.code == body.code.strip(),
        OTPCode.purpose == "forward_verification",
        OTPCode.used == False,  # noqa: E712
    ).first()

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")

    if otp.expires_at < datetime.utcnow():
        otp.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    # Mark OTP used and verify the user's forward email
    otp.used = True
    current_user.is_forward_verified = True
    db.add(otp)
    db.add(current_user)
    db.commit()

    return {"message": "Email verified successfully!"}


@router.post("/resend-otp", status_code=status.HTTP_200_OK)
def resend_otp(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Resend the verification OTP to the user's forwarding email.
    """
    if current_user.is_forward_verified:
        raise HTTPException(status_code=400, detail="Email is already verified.")

    try:
        _create_and_send_otp(current_user, db)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP email. Please check your SMTP configuration.",
        ) from exc

    return {"message": f"OTP sent to {current_user.forward_email}"}
