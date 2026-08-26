from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Float

from app.core.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    asset_type = Column(String(50), nullable=False)

    target = Column(String(255), nullable=False, unique=True)

    environment = Column(String(50), default="development")

    status = Column(String(50), default="active")

    risk_score = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    