from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

class AliasBase(BaseModel):
    pass

class AliasCreate(AliasBase):
    pass # No input needed for random generation

class AliasUpdate(BaseModel):
    status: str # active or disabled

class AliasResponse(AliasBase):
    id: int
    user_id: int
    alias: str
    type: str
    status: str
    mail_count: int
    created_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
