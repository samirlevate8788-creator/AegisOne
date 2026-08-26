from typing import Optional

from pydantic import BaseModel, ConfigDict


class FindingCreate(BaseModel):
    asset_id: int
    title: str
    severity: str = "medium"
    description: Optional[str] = None
    recommendation: Optional[str] = None


class FindingResponse(BaseModel):
    id: int
    asset_id: int
    title: str
    severity: str
    description: Optional[str] = None
    recommendation: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)
    