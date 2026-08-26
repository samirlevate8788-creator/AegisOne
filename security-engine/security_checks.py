"""
AegisOne Security Engine
Defensive security configuration and validation utilities.
"""

from pathlib import Path
import json


CONFIG_PATH = Path(__file__).parent / "security_config.json"


def load_config():
    """Load the security engine configuration."""
    with CONFIG_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def validate_severity(severity: str) -> bool:
    """Validate a supported security severity level."""
    config = load_config()
    levels = config["engine"]["version"] and config["severity_levels"]
    return severity.lower() in levels


def validate_target(target: str) -> bool:
    """Perform basic target validation."""
    if not target or not isinstance(target, str):
        return False

    target = target.strip()

    if len(target) > 253:
        return False

    if any(char in target for char in [" ", "\n", "\r", "\t"]):
        return False

    return True


def security_engine_status():
    """Return the current security engine status."""
    config = load_config()

    return {
        "engine": config["engine"]["name"],
        "version": config["engine"]["version"],
        "mode": config["engine"]["mode"],
        "status": "active",
        "checks_enabled": config["checks"]
    }


if __name__ == "__main__":
    print(json.dumps(security_engine_status(), indent=2))
    