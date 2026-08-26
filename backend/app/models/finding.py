from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(
        Integer,
        ForeignKey("assets.id"),
        nullable=False
    )

    title = Column(String(200), nullable=False)

    severity = Column(
        String(50),
        nullable=False,
        default="medium"
    )

    description = Column(Text, nullable=True)

    recommendation = Column(Text, nullable=True)

    status = Column(
        String(50),
        nullable=False,
        default="open"
    )

    asset = relationship("Asset")
