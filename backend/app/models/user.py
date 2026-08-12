from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    forward_email = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_forward_verified = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="active", nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    aliases = relationship("Alias", back_populates="user", cascade="all, delete-orphan")
