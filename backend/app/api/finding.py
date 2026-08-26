from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset
from app.models.finding import Finding
from app.schemas.finding import FindingCreate, FindingResponse


router = APIRouter(
    prefix="/api/findings",
    tags=["Security Findings"]
)


@router.post("/", response_model=FindingResponse)
def create_finding(
    data: FindingCreate,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == data.asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    finding = Finding(
        asset_id=data.asset_id,
        title=data.title,
        severity=data.severity,
        description=data.description,
        recommendation=data.recommendation,
        status="open"
    )

    db.add(finding)
    db.commit()
    db.refresh(finding)

    return finding


@router.get("/", response_model=list[FindingResponse])
def get_findings(
    db: Session = Depends(get_db)
):
    return db.query(Finding).all()


@router.get("/{finding_id}", response_model=FindingResponse)
def get_finding(
    finding_id: int,
    db: Session = Depends(get_db)
):
    finding = (
        db.query(Finding)
        .filter(Finding.id == finding_id)
        .first()
    )

    if not finding:
        raise HTTPException(
            status_code=404,
            detail="Finding not found"
        )

    return finding


@router.put("/{finding_id}", response_model=FindingResponse)
def update_finding(
    finding_id: int,
    data: FindingCreate,
    db: Session = Depends(get_db)
):
    finding = (
        db.query(Finding)
        .filter(Finding.id == finding_id)
        .first()
    )

    if not finding:
        raise HTTPException(
            status_code=404,
            detail="Finding not found"
        )

    asset = (
        db.query(Asset)
        .filter(Asset.id == data.asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    finding.asset_id = data.asset_id
    finding.title = data.title
    finding.severity = data.severity
    finding.description = data.description
    finding.recommendation = data.recommendation

    db.commit()
    db.refresh(finding)

    return finding


@router.delete("/{finding_id}")
def delete_finding(
    finding_id: int,
    db: Session = Depends(get_db)
):
    finding = (
        db.query(Finding)
        .filter(Finding.id == finding_id)
        .first()
    )

    if not finding:
        raise HTTPException(
            status_code=404,
            detail="Finding not found"
        )

    db.delete(finding)
    db.commit()

    return {
        "message": "Finding deleted successfully",
        "finding_id": finding_id
    }
