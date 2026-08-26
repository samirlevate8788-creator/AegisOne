from pydantic import BaseModel, ConfigDict
from datetime import datetime


class AssetCreate(BaseModel):
    name: str
    asset_type: str
    target: str
    environment: str = "development"


class AssetResponse(BaseModel):
    id: int
    name: str
    asset_type: str
    target: str
    environment: str
    status: str
    risk_score: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    