from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    api_port: int = Field(default=8002, alias="API_PORT")
    database_url: str = Field(
        default="sqlite+pysqlite:///./system_b.db",
        alias="DATABASE_URL",
    )
    db_schema: str = Field(default="system_b", alias="DB_SCHEMA")
    keycloak_server_url: str = Field(default="http://localhost:8081", alias="KEYCLOAK_SERVER_URL")
    keycloak_public_url: str = Field(default="http://localhost:8081", alias="KEYCLOAK_PUBLIC_URL")
    keycloak_realm: str = Field(default="medilab-secure", alias="KEYCLOAK_REALM")
    keycloak_client_id: str = Field(default="system-a-web", alias="KEYCLOAK_CLIENT_ID")
    keycloak_allowed_client_ids: str = Field(
        default="system-a-web",
        alias="KEYCLOAK_ALLOWED_CLIENT_IDS",
    )
    vault_addr: str = Field(default="http://localhost:8200", alias="VAULT_ADDR")
    vault_token: str = Field(default="root", alias="VAULT_TOKEN")
    vault_transit_key: str = Field(default="medilab-lab-results", alias="VAULT_TRANSIT_KEY")
    cors_origins: list[str] = Field(
        default=[
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://127.0.0.1:5174",
            "http://localhost:5174",
        ],
        alias="CORS_ORIGINS",
    )


settings = Settings()
