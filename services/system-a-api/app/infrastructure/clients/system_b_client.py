from time import monotonic

import httpx

from app.config import settings
from app.domain.entities.lab_result import LabResult
from app.domain.services.errors import UpstreamServiceError
from app.domain.services.lab_result_gateway import LabResultGateway
from app.domain.services.transit_errors import TransitCipherError
from app.infrastructure.mappers.lab_result_mapper import map_lab_result_payload
from app.infrastructure.security.vault_transit_cipher import VaultTransitCipher

_system_b_async_client = httpx.AsyncClient(timeout=20.0)


class SystemBLabResultGateway(LabResultGateway):
    _cache_ttl_seconds = 30.0
    _cached_results: dict[int, tuple[float, list[LabResult]]] = {}

    def __init__(self, base_url: str | None = None):
        self._base_url = (base_url or settings.system_b_base_url).rstrip("/")
        self._transit_cipher = VaultTransitCipher()

    async def get_lab_results(self, patient_id: int, access_token: str | None = None) -> list[LabResult]:
        cached = self._cached_results.get(patient_id)
        if cached and cached[0] > monotonic():
            return cached[1]

        url = f"{self._base_url}/api/v1/lab-results/query"
        headers = {"Authorization": f"Bearer {access_token}"} if access_token else None
        try:
            encrypted_payload = await self._transit_cipher.encrypt_json({"patient_id": patient_id})
        except TransitCipherError as exc:
            raise UpstreamServiceError("Unable to encrypt the laboratory request.") from exc
        try:
            response = await _system_b_async_client.post(
                url,
                headers=headers,
                json={"ciphertext": encrypted_payload},
            )
        except httpx.HTTPError as exc:
            raise UpstreamServiceError("Unable to reach laboratory service.") from exc

        if response.status_code != 200:
            raise UpstreamServiceError("Laboratory service returned an unexpected response.")

        response_payload = response.json()
        try:
            decrypted_payload = await self._transit_cipher.decrypt_json(response_payload["ciphertext"])
        except TransitCipherError as exc:
            raise UpstreamServiceError("Unable to decrypt the laboratory response.") from exc
        results = [map_lab_result_payload(item) for item in decrypted_payload["lab_results"]]
        self._cached_results[patient_id] = (monotonic() + self._cache_ttl_seconds, results)
        return results
