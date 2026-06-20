import base64
import json
from typing import Any

import httpx

from app.config import settings
from app.domain.services.transit_cipher import TransitCipher
from app.domain.services.transit_errors import TransitCipherError

_vault_async_client = httpx.AsyncClient(timeout=8.0)


class VaultTransitCipher(TransitCipher):
    def __init__(
        self,
        base_url: str | None = None,
        token: str | None = None,
        key_name: str | None = None,
    ):
        self._base_url = (base_url or settings.vault_addr).rstrip("/")
        self._token = token or settings.vault_token
        self._key_name = key_name or settings.vault_transit_key

    async def encrypt_json(self, payload: Any) -> str:
        plaintext = json.dumps(payload, separators=(",", ":"), default=str).encode("utf-8")
        encoded = base64.b64encode(plaintext).decode("utf-8")
        response_payload = await self._post(
            f"{self._base_url}/v1/transit/encrypt/{self._key_name}",
            {"plaintext": encoded},
        )
        return response_payload["data"]["ciphertext"]

    async def decrypt_json(self, ciphertext: str) -> Any:
        response_payload = await self._post(
            f"{self._base_url}/v1/transit/decrypt/{self._key_name}",
            {"ciphertext": ciphertext},
        )
        encoded = response_payload["data"]["plaintext"]
        plaintext = base64.b64decode(encoded).decode("utf-8")
        return json.loads(plaintext)

    async def _post(self, url: str, payload: dict[str, str]) -> dict[str, Any]:
        headers = {"X-Vault-Token": self._token}
        try:
            response = await _vault_async_client.post(url, json=payload, headers=headers)
        except httpx.HTTPError as exc:
            raise TransitCipherError("Unable to reach Vault Transit.") from exc

        if response.status_code not in {200, 204}:
            raise TransitCipherError("Vault Transit returned an unexpected response.")

        return response.json()
