def test_root(client):
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["project"] == "AegisOne"
    assert data["status"] == "online"


def test_health(client):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == "AegisOne API"
    assert data["version"] == "1.0.0"
    