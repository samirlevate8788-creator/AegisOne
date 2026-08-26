from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetResponse


router = APIRouter(
    prefix="/api/assets",
    tags=["Assets"]
)


# CREATE ASSET
@router.post("/", response_model=AssetResponse)
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db)
):
    existing_asset = (
        db.query(Asset)
        .filter(Asset.target == asset.target)
        .first()
    )

    if existing_asset:
        raise HTTPException(
            status_code=409,
            detail="Asset with this target already exists"
        )

    new_asset = Asset(
        name=asset.name,
        asset_type=asset.asset_type,
        target=asset.target,
        environment=asset.environment,
        status="active",
        risk_score=0
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return new_asset


# GET ALL ASSETS
@router.get("/", response_model=list[AssetResponse])
def get_assets(
    db: Session = Depends(get_db)
):
    return db.query(Asset).all()


# GET SINGLE ASSET
@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return asset


# UPDATE ASSET
@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    asset_data: AssetCreate,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    duplicate = (
        db.query(Asset)
        .filter(
            Asset.target == asset_data.target,
            Asset.id != asset_id
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Another asset with this target already exists"
        )

    asset.name = asset_data.name
    asset.asset_type = asset_data.asset_type
    asset.target = asset_data.target
    asset.environment = asset_data.environment

    db.commit()
    db.refresh(asset)

    return asset


# DELETE ASSET
@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    db.delete(asset)
    db.commit()

    return {
        "message": "Asset deleted successfully",
        "asset_id": asset_id
    }
