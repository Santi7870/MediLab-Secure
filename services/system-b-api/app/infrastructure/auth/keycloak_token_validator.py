from jwt import PyJWKClient, decode
from jwt.exceptions import InvalidTokenError

from app.config import settings
from app.domain.services.authenticated_user import AuthenticatedUser
from app.domain.services.auth_errors import AuthenticationError
from app.domain.services.token_validator import TokenValidator


class KeycloakTokenValidator(TokenValidator):
    def __init__(self):
        internal_realm_url = f"{settings.keycloak_server_url}/realms/{settings.keycloak_realm}"
        public_realm_url = f"{settings.keycloak_public_url}/realms/{settings.keycloak_realm}"
        self._issuer = public_realm_url
        self._jwk_client = PyJWKClient(f"{internal_realm_url}/protocol/openid-connect/certs")
        self._allowed_client_ids = {
            client_id.strip()
            for client_id in settings.keycloak_allowed_client_ids.split(",")
            if client_id.strip()
        }

    def validate(self, access_token: str) -> AuthenticatedUser:
        try:
            signing_key = self._jwk_client.get_signing_key_from_jwt(access_token)
            payload = decode(
                access_token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=self._issuer,
                options={"verify_aud": False},
            )
        except InvalidTokenError as exc:
            raise AuthenticationError("Invalid or expired access token.") from exc

        if payload.get("azp") not in self._allowed_client_ids:
            raise AuthenticationError("Token was not issued for an allowed frontend client.")

        roles = tuple(payload.get("realm_access", {}).get("roles", []))
        return AuthenticatedUser(
            subject=payload["sub"],
            username=payload.get("preferred_username"),
            roles=roles,
            access_token=access_token,
        )
