from fastapi.testclient import TestClient
from unittest.mock import patch
from backend.app.main import app, SCAN_STORE

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "rubric_version" in data

def test_headers_educational_endpoint():
    res = client.get("/api/v1/headers")
    assert res.status_code == 200
    headers = res.json()
    assert len(headers) >= 6
    names = [h["name"] for h in headers]
    assert "Content-Security-Policy" in names
    assert "Strict-Transport-Security" in names

@patch("backend.app.main.fetch_and_analyze")
def test_scan_endpoint(mock_fetch):
    mock_fetch.return_value = {
        "id": "scan_test_123",
        "url": "https://example.com",
        "score": 90,
        "grade": "A",
        "rubric_version": "1.0.0",
        "summary": {"passed": 6, "warnings": 1, "failed": 1, "total_rules": 8},
        "findings": [
            {
                "name": "Strict-Transport-Security",
                "status": "pass",
                "severity": "info",
                "score": 20,
                "max_score": 20,
                "value": "max-age=31536000",
                "message": "Valid HSTS",
                "recommendation": "max-age=31536000",
                "why_it_matters": "Enforces HTTPS",
                "fixes": {"Nginx": "add_header Strict-Transport-Security ..."}
            }
        ],
        "raw_headers": {"strict-transport-security": "max-age=31536000"},
        "redirect_chain": [],
        "tls_summary": {"protocol": "TLSv1.3"},
        "scanned_at": "2026-10-15T12:00:00Z"
    }

    res = client.post("/api/v1/scan", json={"url": "https://example.com", "follow_redirects": True})
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "scan_test_123"
    assert data["score"] == 90
    assert data["grade"] == "A"

    # Test retrieval
    res_get = client.get("/api/v1/scan/scan_test_123")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == "scan_test_123"

    # Test CSV export
    res_csv = client.get("/api/v1/export/scan_test_123?format=csv")
    assert res_csv.status_code == 200
    assert "Strict-Transport-Security" in res_csv.text

def test_ssrf_rejection():
    # Attempting to scan loopback IP directly via endpoint
    res = client.post("/api/v1/scan", json={"url": "http://127.0.0.1:8080"})
    assert res.status_code in [400, 502]
