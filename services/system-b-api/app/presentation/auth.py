from collections.abc import Callable

from fastapi import Depends, Header, HTTPException, status

from app.domain.services.authenticated_user import AuthenticatedUser
from app.domain.services.auth_errors import AuthenticationError
from app.infrastructure.auth.keycloak_token_validator import KeycloakTokenValidator

token_validator = KeycloakTokenValidator()


def require_authenticated_user(authorization: str | None = Header(default=None)) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )

    access_token = authorization.removeprefix("Bearer ").strip()
    try:
        return token_validator.validate(access_token)
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc


def require_any_role(*allowed_roles: str) -> Callable[..., AuthenticatedUser]:
    def dependency(
        authenticated_user: AuthenticatedUser = Depends(require_authenticated_user),
    ) -> AuthenticatedUser:
        if any(role in authenticated_user.roles for role in allowed_roles):
            return authenticated_user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource.",
        )

    return dependency
