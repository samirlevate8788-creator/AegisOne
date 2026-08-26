def test_get_findings(client):
    response = client.get("/api/findings/")

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True

    assert "total" in data
    assert "critical" in data
    assert "high" in data
    assert "medium" in data
    assert "low" in data
    assert "findings" in data

    assert isinstance(data["findings"], list)
    