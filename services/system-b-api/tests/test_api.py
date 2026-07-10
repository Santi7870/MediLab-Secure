from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.domain.services.authenticated_user import AuthenticatedUser
from app.main import app
from app.presentation.auth import require_authenticated_user


def _mock_authenticated_user():
    return AuthenticatedUser(
        subject="demo-subject",
        username="doctor.demo",
        roles=("doctor",),
        access_token="fake-token",
    )


def _mock_laboratory_user():
    return AuthenticatedUser(
        subject="demo-subject",
        username="laboratory.demo",
        roles=("laboratory",),
        access_token="fake-token",
    )


def test_lab_results_endpoint_returns_ok_response():
    app.dependency_overrides[require_authenticated_user] = _mock_authenticated_user
    with TestClient(app) as client:
        response = client.get("/api/v1/lab-results/1")
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_lab_result_returns_created_response():
    app.dependency_overrides[require_authenticated_user] = _mock_laboratory_user
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/lab-results",
            json={
                "patient_id": 3,
                "test_name": "Creatinine",
                "result_value": "1.1",
                "unit": "mg/dL",
                "reference_range": "0.7-1.3",
                "status": "Normal",
                "collected_at": "2026-06-19T14:30:00Z",
            },
        )
    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json()["test_name"] == "Creatinine"


def test_update_lab_result_returns_404_for_unknown_result():
    app.dependency_overrides[require_authenticated_user] = _mock_laboratory_user
    with TestClient(app) as client:
        response = client.put(
            "/api/v1/lab-results/9999",
            json={
                "patient_id": 1,
                "test_name": "Glucose",
                "result_value": "100",
                "unit": "mg/dL",
                "reference_range": "70-100",
                "status": "Normal",
                "collected_at": "2026-06-19T14:30:00Z",
            },
        )
    app.dependency_overrides.clear()

    assert response.status_code == 404
    assert response.json()["detail"] == "Laboratory result not found."


def test_encrypted_lab_results_query_returns_ciphertext_response():
    app.dependency_overrides[require_authenticated_user] = _mock_authenticated_user
    with patch(
        "app.infrastructure.security.vault_transit_cipher.VaultTransitCipher.decrypt_json",
        AsyncMock(return_value={"patient_id": 1}),
    ), patch(
        "app.infrastructure.security.vault_transit_cipher.VaultTransitCipher.encrypt_json",
        AsyncMock(return_value="vault:v1:encrypted-response"),
    ):
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/lab-results/query",
                json={"ciphertext": "vault:v1:encrypted-request"},
            )
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["ciphertext"] == "vault:v1:encrypted-response"


def test_lab_results_endpoint_returns_403_when_role_is_not_allowed():
    def patient_role_user():
        return AuthenticatedUser(
            subject="demo-subject",
            username="patient.demo",
            roles=("patient",),
            access_token="fake-token",
        )

    app.dependency_overrides[require_authenticated_user] = patient_role_user
    with TestClient(app) as client:
        response = client.get("/api/v1/lab-results/1")
    app.dependency_overrides.clear()

    assert response.status_code == 403
    assert response.json()["detail"] == "You do not have permission to access this resource."
