from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()

    def create(self, user_in: UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        
        # Use username as email if not provided separately
        # Or parse from schemas... Let's use the fields present in User model
        db_user = User(
            email=getattr(user_in, "email", user_in.forward_email), # fallback to forward_email
            username=user_in.username,
            forward_email=user_in.forward_email,
            password_hash=hashed_password,
            is_verified=False,
            is_forward_verified=False
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_verification_status(self, user: User, is_forward_verified: bool = True) -> User:
        user.is_forward_verified = is_forward_verified
        self.db.commit()
        self.db.refresh(user)
        return user
