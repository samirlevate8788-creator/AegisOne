"""
AegisOne AI Risk Engine

Defensive risk analysis utilities for security posture assessment.
"""

from pathlib import Path
import json


CONFIG_PATH = Path(__file__).parent / "ai_config.json"


def load_config():
    """Load AI risk-engine configuration."""
    with CONFIG_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def classify_risk(score: float) -> str:
    """Classify a risk score from 0 to 100."""
    if not 0 <= score <= 100:
        raise ValueError("Risk score must be between 0 and 100.")

    config = load_config()["risk_levels"]

    for level, limits in config.items():
        if limits["minimum"] <= score <= limits["maximum"]:
            return level

    raise ValueError("Unable to classify risk score.")


def generate_recommendation(risk_level: str) -> str:
    """Generate a defensive recommendation."""
    recommendations = {
        "low": "Continue routine security monitoring.",
        "medium": "Review security configuration and address identified findings.",
        "high": "Prioritize remediation and perform an immediate security review.",
        "critical": "Escalate immediately and prioritize critical remediation."
    }

    return recommendations.get(
        risk_level.lower(),
        "Review the security posture."
    )


def analyze_risk(score: float) -> dict:
    """Analyze a security risk score."""
    level = classify_risk(score)

    return {
        "risk_score": score,
        "risk_level": level,
        "recommendation": generate_recommendation(level)
    }


def engine_status() -> dict:
    """Return current AI engine status."""
    config = load_config()

    return {
        "engine": config["engine"]["name"],
        "version": config["engine"]["version"],
        "mode": config["engine"]["mode"],
        "status": "active",
        "analysis": config["analysis"]
    }


if __name__ == "__main__":
    print(json.dumps(engine_status(), indent=2))
    