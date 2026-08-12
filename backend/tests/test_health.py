"""Smoke tests for the health check endpoint."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_endpoint_returns_200() -> None:
    """The health endpoint must always return HTTP 200, even if a
    dependency (DB/Redis) is degraded -- monitors care about the API
    process being alive, and the payload's `status` field reports the
    finer-grained detail."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_endpoint_payload_shape() -> None:
    response = client.get("/api/v1/health")
    body = response.json()

    assert body["app_name"] == "ThorTheHost"
    assert body["status"] in {"ok", "degraded"}
    assert isinstance(body["components"], list)
    component_names = {c["name"] for c in body["components"]}
    assert {"postgresql", "redis"}.issubset(component_names)
