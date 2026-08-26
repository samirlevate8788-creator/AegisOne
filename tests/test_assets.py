def test_get_assets(client):
    response = client.get("/api/assets/")

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert "total" in data
    assert "assets" in data

    assert isinstance(data["assets"], list)


def test_create_asset(client):
    payload = {
        "name": "Pytest Verification Server",
        "type": "server",
        "target": "10.10.10.10",
        "environment": "testing"
    }

    response = client.post(
        "/api/assets/",
        json=payload
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert data["success"] is True
    assert "asset" in data

    asset = data["asset"]

    assert asset["name"] == payload["name"]
    assert asset["type"] == payload["type"]
    assert asset["target"] == payload["target"]
    assert asset["environment"] == payload["environment"]


def test_asset_not_found(client):
    response = client.get("/api/assets/999999")

    assert response.status_code in (404, 405)
    