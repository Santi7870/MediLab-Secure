from unittest.mock import AsyncMock, Mock, patch

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


def test_patients_endpoint_returns_seeded_contract():
    app.dependency_overrides[require_authenticated_user] = _mock_authenticated_user
    with TestClient(app) as client:
        response = client.get("/api/v1/patients")
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_system_a_lab_results_endpoint_calls_system_b_gateway():
    app.dependency_overrides[require_authenticated_user] = _mock_authenticated_user
    mocked_gateway_response = [
        {
            "id": 1,
            "patient_id": 1,
            "test_name": "Glucose",
            "result_value": "98",
            "unit": "mg/dL",
            "reference_range": "70-100",
            "status": "Normal",
            "collected_at": "2026-06-18T12:00:00Z",
        }
    ]

    mocked_response = Mock()
    mocked_response.status_code = 200
    mocked_response.json.return_value = {"ciphertext": "vault:v1:response"}

    async_post = AsyncMock(return_value=mocked_response)

    with patch(
        "app.infrastructure.clients.system_b_client.VaultTransitCipher.encrypt_json",
        AsyncMock(return_value="vault:v1:request"),
    ), patch(
        "app.infrastructure.clients.system_b_client.VaultTransitCipher.decrypt_json",
        AsyncMock(return_value={"lab_results": mocked_gateway_response}),
    ), patch("app.infrastructure.clients.system_b_client.httpx.AsyncClient.post", async_post):
        with TestClient(app) as client:
            response = client.get("/api/v1/patients/1/lab-results")
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["test_name"] == "Glucose"


def test_patients_endpoint_returns_403_when_role_is_not_allowed():
    def patient_role_user():
        return AuthenticatedUser(
            subject="demo-subject",
            username="patient.demo",
            roles=("patient",),
            access_token="fake-token",
        )

    app.dependency_overrides[require_authenticated_user] = patient_role_user
    with TestClient(app) as client:
        response = client.get("/api/v1/patients")
    app.dependency_overrides.clear()

    assert response.status_code == 403
    assert response.json()["detail"] == "You do not have permission to access this resource."
