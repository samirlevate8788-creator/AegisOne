# backend/app/api/risk.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset
from app.services.risk_engine import calculate_risk_score, get_risk_level


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk"]
)


@router.get("/")
def get_risk_overview(
    db: Session = Depends(get_db),
):
    """
    Get risk information for all assets.
    """

    assets = db.query(Asset).all()

    results = []

    for asset in assets:
        score = calculate_risk_score(
            asset_type=asset.asset_type,
            environment=asset.environment,
            target=asset.target,
        )

        level = get_risk_level(score)

        results.append(
            {
                "asset_id": asset.id,
                "name": asset.name,
                "asset_type": asset.asset_type,
                "target": asset.target,
                "environment": asset.environment,
                "risk_score": score,
                "risk_level": level,
                "status": asset.status,
            }
        )

    return {
        "total_assets": len(results),
        "assets": results,
    }


@router.get("/{asset_id}")
def get_asset_risk(
    asset_id: int,
    db: Session = Depends(get_db),
):
    """
    Calculate and return the risk information for one asset.
    """

    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    score = calculate_risk_score(
        asset_type=asset.asset_type,
        environment=asset.environment,
        target=asset.target,
    )

    level = get_risk_level(score)

    return {
        "asset_id": asset.id,
        "name": asset.name,
        "asset_type": asset.asset_type,
        "target": asset.target,
        "environment": asset.environment,
        "status": asset.status,
        "risk_score": score,
        "risk_level": level,
    }


@router.post("/{asset_id}/calculate")
def calculate_asset_risk(
    asset_id: int,
    db: Session = Depends(get_db),
):
    """
    Calculate the risk score and save it to the asset.
    """

    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    score = calculate_risk_score(
        asset_type=asset.asset_type,
        environment=asset.environment,
        target=asset.target,
    )

    level = get_risk_level(score)

    asset.risk_score = score

    db.commit()
    db.refresh(asset)

    return {
        "message": "Risk score calculated successfully",
        "asset_id": asset.id,
        "name": asset.name,
        "risk_score": score,
        "risk_level": level,
    }
