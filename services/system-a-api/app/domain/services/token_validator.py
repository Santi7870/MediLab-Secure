from abc import ABC, abstractmethod

from app.domain.services.authenticated_user import AuthenticatedUser


class TokenValidator(ABC):
    @abstractmethod
    def validate(self, access_token: str) -> AuthenticatedUser:
        raise NotImplementedError
