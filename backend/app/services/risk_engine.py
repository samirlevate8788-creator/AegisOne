"""
AegisOne Risk Engine

Calculates a deterministic risk score for an asset.
"""


def calculate_risk_score(
    asset_type=None,
    environment=None,
    target=None,
    **kwargs
):
    """
    Calculate a risk score from 0 to 100.

    Higher score = higher security risk.
    """

    score = 0

    asset_type = str(
        asset_type or ""
    ).lower().strip()

    environment = str(
        environment or ""
    ).lower().strip()

    target = str(
        target or ""
    ).lower().strip()


    # ---------------------------------------------------------
    # ASSET TYPE
    # ---------------------------------------------------------

    asset_scores = {
        "server": 25,
        "database": 30,
        "website": 20,
        "application": 20,
        "network": 30,
    }

    score += asset_scores.get(
        asset_type,
        15
    )


    # ---------------------------------------------------------
    # ENVIRONMENT
    # ---------------------------------------------------------

    environment_scores = {
        "production": 30,
        "staging": 15,
        "development": 5,
    }

    score += environment_scores.get(
        environment,
        10
    )


    # ---------------------------------------------------------
    # TARGET
    # ---------------------------------------------------------

    if target:

        # Public-looking targets receive additional risk.
        if (
            "." in target
            or target.startswith("http://")
            or target.startswith("https://")
        ):
            score += 15

        else:
            score += 5


    # ---------------------------------------------------------
    # LIMIT SCORE
    # ---------------------------------------------------------

    score = max(
        0,
        min(score, 100)
    )


    return score


def get_risk_level(score):
    """
    Convert numeric score to risk level.
    """

    score = float(score)


    if score >= 80:
        return "critical"

    if score >= 60:
        return "high"

    if score >= 30:
        return "medium"

    return "low"
