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


def test_lab_results_endpoint_returns_ok_response():
    app.dependency_overrides[require_authenticated_user] = _mock_authenticated_user
    with TestClient(app) as client:
        response = client.get("/api/v1/lab-results/1")
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert isinstance(response.json(), list)


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
