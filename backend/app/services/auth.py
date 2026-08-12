from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest
from app.core.security import verify_password
from app.models.user import User
from app.services.cloudflare_service import cloudflare_email

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    async def register_user(self, user_in: UserCreate) -> User:
        # Check if user exists
        if self.user_repo.get_by_email(user_in.forward_email) or self.user_repo.get_by_username(user_in.username):
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # Create user
        user = self.user_repo.create(user_in)

        # Tell Cloudflare to send a verification email to their forward_email
        try:
            await cloudflare_email.add_destination_address(user.forward_email)
        except Exception as e:
            # We don't want to fail registration if Cloudflare errors out, but we might log it
            print(f"Failed to add destination address to Cloudflare: {e}")

        return user

    def authenticate_user(self, login_data: LoginRequest) -> User:
        user = self.user_repo.get_by_email(login_data.login)
        if not user:
            user = self.user_repo.get_by_username(login_data.login)
            
        if not user:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
            
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
            
        return user
