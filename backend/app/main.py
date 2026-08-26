from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional


# ============================================================
# AEGISONE APPLICATION
# ============================================================

app = FastAPI(
    title="AegisOne",
    version="1.0.0",
    description="AI-Powered Cybersecurity & Digital Risk Platform",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://aegisone-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DEMO DATA
# ============================================================

assets = [
    {
        "id": 1,
        "name": "AegisOne Test Server",
        "type": "server",
        "target": "192.168.1.100",
        "environment": "development",
        "status": "active",
        "risk_score": 45,
        "risk_level": "medium",
    }
]


findings = [
    {
        "id": 1,
        "title": "Security Configuration Review",
        "severity": "medium",
        "status": "open",
        "asset": "AegisOne Test Server",
        "description": "Security configuration requires review.",
    }
]


# ============================================================
# REQUEST MODELS
# ============================================================

class AssetCreate(BaseModel):
    name: str
    type: str = "server"
    target: str
    environment: str = "development"


# ============================================================
# ROOT
# ============================================================

@app.get("/", tags=["System"])
def root():
    return {
        "project": "AegisOne",
        "status": "online",
        "version": "1.0.0",
        "message": "AegisOne backend is running",
        "docs": "/docs",
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "healthy",
        "service": "AegisOne API",
        "version": "1.0.0",
    }


# ============================================================
# API INFORMATION
# ============================================================

@app.get("/api/info", tags=["System"])
def api_info():
    return {
        "application": "AegisOne",
        "version": "1.0.0",
        "status": "running",
        "modules": [
            "Asset Management",
            "Risk Management",
            "Security Findings",
        ],
        "endpoints": {
            "health": "/health",
            "assets": "/api/assets/",
            "risk": "/api/risk/",
            "findings": "/api/findings/",
            "docs": "/docs",
            "info": "/api/info",
        },
    }


# ============================================================
# ASSETS
# ============================================================

@app.get("/api/assets/", tags=["Assets"])
def get_assets():
    return {
        "success": True,
        "total": len(assets),
        "assets": assets,
    }


# ============================================================
# GET SINGLE ASSET
# ============================================================

@app.get("/api/assets/{asset_id}", tags=["Assets"])
def get_asset(asset_id: int):

    for asset in assets:
        if asset["id"] == asset_id:
            return {
                "success": True,
                "asset": asset,
            }

    raise HTTPException(
        status_code=404,
        detail="Asset not found"
    )


# ============================================================
# CREATE ASSET
# ============================================================

@app.post("/api/assets/", tags=["Assets"])
def create_asset(asset: AssetCreate):

    new_id = max(
        [item["id"] for item in assets],
        default=0
    ) + 1

    new_asset = {
        "id": new_id,
        "name": asset.name,
        "type": asset.type,
        "target": asset.target,
        "environment": asset.environment,
        "status": "active",
        "risk_score": 0,
        "risk_level": "not_calculated",
    }

    assets.append(new_asset)

    return {
        "success": True,
        "message": "Asset created successfully",
        "asset": new_asset,
    }


# ============================================================
# DELETE ASSET
# ============================================================

@app.delete("/api/assets/{asset_id}", tags=["Assets"])
def delete_asset(asset_id: int):

    for index, asset in enumerate(assets):

        if asset["id"] == asset_id:

            deleted = assets.pop(index)

            return {
                "success": True,
                "message": "Asset deleted successfully",
                "asset": deleted,
            }

    raise HTTPException(
        status_code=404,
        detail="Asset not found"
    )


# ============================================================
# RISK
# ============================================================

@app.get("/api/risk/", tags=["Risk"])
def get_risk():

    total = len(assets)

    critical = sum(
        1
        for asset in assets
        if asset.get("risk_score", 0) >= 80
    )

    high = sum(
        1
        for asset in assets
        if 60 <= asset.get("risk_score", 0) < 80
    )

    scores = [
        asset.get("risk_score", 0)
        for asset in assets
        if asset.get("risk_score") is not None
    ]

    average = (
        round(sum(scores) / len(scores), 1)
        if scores
        else 0
    )

    return {
        "success": True,
        "total_assets": total,
        "critical": critical,
        "high": high,
        "average": average,
        "average_risk": average,
    }


# ============================================================
# CALCULATE RISK
# ============================================================

@app.post("/api/risk/{asset_id}", tags=["Risk"])
def calculate_risk(asset_id: int):

    for asset in assets:

        if asset["id"] == asset_id:

            # Demo risk calculation
            score = 45

            if score >= 80:
                level = "critical"
            elif score >= 60:
                level = "high"
            elif score >= 30:
                level = "medium"
            else:
                level = "low"

            asset["risk_score"] = score
            asset["risk_level"] = level

            return {
                "success": True,
                "message": "Risk calculated successfully",
                "asset_id": asset_id,
                "risk_score": score,
                "risk_level": level,
            }

    raise HTTPException(
        status_code=404,
        detail="Asset not found"
    )


# ============================================================
# FINDINGS
# ============================================================

@app.get("/api/findings/", tags=["Findings"])
def get_findings():

    critical = sum(
        1
        for finding in findings
        if finding["severity"].lower() == "critical"
    )

    high = sum(
        1
        for finding in findings
        if finding["severity"].lower() == "high"
    )

    medium = sum(
        1
        for finding in findings
        if finding["severity"].lower() == "medium"
    )

    low = sum(
        1
        for finding in findings
        if finding["severity"].lower() == "low"
    )

    return {
        "success": True,
        "total": len(findings),
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "findings": findings,
    }


# ============================================================
# STARTUP MESSAGE
# ============================================================

@app.on_event("startup")
def startup_event():
    print("")
    print("=" * 60)
    print("AegisOne API started successfully")
    print("API      : http://127.0.0.1:8000")
    print("Docs     : http://127.0.0.1:8000/docs")
    print("Health   : http://127.0.0.1:8000/health")
    print("=" * 60)
    print("")
    
