from pydantic import BaseModel


class EncryptedPayloadRequest(BaseModel):
    ciphertext: str


class EncryptedPayloadResponse(BaseModel):
    ciphertext: str
