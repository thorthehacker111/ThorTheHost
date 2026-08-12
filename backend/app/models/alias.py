from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.session import Base

class Alias(Base):
    __tablename__ = "aliases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    alias = Column(String(255), unique=True, index=True, nullable=False)
    type = Column(String(50), default="random", nullable=False) # random, custom
    status = Column(String(20), default="active", nullable=False) # active, disabled, deleted
    mail_count = Column(Integer, default=0, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime, nullable=True) # Logical deletion

    user = relationship("User", back_populates="aliases")
