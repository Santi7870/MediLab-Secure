from abc import ABC, abstractmethod
from typing import Any


class TransitCipher(ABC):
    @abstractmethod
    async def encrypt_json(self, payload: Any) -> str:
        raise NotImplementedError

    @abstractmethod
    async def decrypt_json(self, ciphertext: str) -> Any:
        raise NotImplementedError
