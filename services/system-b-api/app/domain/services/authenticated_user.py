from dataclasses import dataclass


@dataclass(frozen=True)
class AuthenticatedUser:
    subject: str
    username: str | None
    roles: tuple[str, ...]
    access_token: str
