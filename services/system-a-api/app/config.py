from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    api_port: int = Field(default=8001, alias="API_PORT")
    database_url: str = Field(
        default="sqlite+pysqlite:///./system_a.db",
        alias="DATABASE_URL",
    )
    db_schema: str = Field(default="system_a", alias="DB_SCHEMA")
    system_b_base_url: str = Field(default="http://127.0.0.1:8002", alias="SYSTEM_B_BASE_URL")
    keycloak_server_url: str = Field(default="http://localhost:8081", alias="KEYCLOAK_SERVER_URL")
    keycloak_realm: str = Field(default="medilab-secure", alias="KEYCLOAK_REALM")
    keycloak_client_id: str = Field(default="system-a-web", alias="KEYCLOAK_CLIENT_ID")
    vault_addr: str = Field(default="http://localhost:8200", alias="VAULT_ADDR")
    vault_token: str = Field(default="root", alias="VAULT_TOKEN")
    vault_transit_key: str = Field(default="medilab-lab-results", alias="VAULT_TRANSIT_KEY")
    cors_origins: list[str] = Field(
        default=["http://127.0.0.1:5173", "http://localhost:5173"],
        alias="CORS_ORIGINS",
    )


settings = Settings()
