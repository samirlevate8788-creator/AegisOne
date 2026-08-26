def test_risk_overview(client):
    response = client.get("/api/risk/")

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert "total_assets" in data
    assert "critical" in data
    assert "high" in data
    assert "average" in data
    assert "average_risk" in data


def test_risk_calculation(client):
    # First obtain an available asset.
    assets_response = client.get("/api/assets/")

    assert assets_response.status_code == 200

    assets_data = assets_response.json()

    assert assets_data["success"] is True
    assert len(assets_data["assets"]) > 0

    asset_id = assets_data["assets"][0]["id"]

    response = client.post(
        f"/api/risk/{asset_id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["asset_id"] == asset_id
    assert "risk_score" in data
    assert "risk_level" in data


def test_invalid_risk_endpoint(client):
    response = client.post(
        "/api/risk/999999"
    )

    assert response.status_code in (404, 400)
    