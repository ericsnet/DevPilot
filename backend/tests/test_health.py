from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_liveness_returns_ok():
    response = client.get("/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_api_root_returns_foundation_status():
    response = client.get("/api/v1")
    assert response.status_code == 200
    assert response.json()["status"] == "foundation"
