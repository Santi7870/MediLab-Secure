import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? "http://localhost:8081",
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? "medilab-secure",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "system-b-web"
});
