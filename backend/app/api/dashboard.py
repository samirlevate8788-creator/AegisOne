from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset
from app.models.finding import Finding

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    assets = db.query(Asset).all()
    findings = db.query(Finding).all()

    total_assets = len(assets)

    critical = sum(
        1 for a in assets
        if (a.risk_score or 0) >= 80
    )

    high = sum(
        1 for a in assets
        if 60 <= (a.risk_score or 0) < 80
    )

    medium = sum(
        1 for a in assets
        if 30 <= (a.risk_score or 0) < 60
    )

    low = sum(
        1 for a in assets
        if (a.risk_score or 0) < 30
    )

    average_risk = (
        round(
            sum((a.risk_score or 0) for a in assets)
            / total_assets,
            2
        )
        if total_assets
        else 0
    )

    return {
        "total_assets": total_assets,
        "critical_assets": critical,
        "high_risk_assets": high,
        "medium_risk_assets": medium,
        "low_risk_assets": low,
        "average_risk_score": average_risk,
        "total_findings": len(findings),
        "open_findings": sum(
            1 for f in findings
            if f.status == "open"
        )
    }
