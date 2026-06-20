import type { AuthSession } from "../../domain/models/AuthSession";
import { keycloak } from "../../infrastructure/auth/keycloak";

export class AuthService {
  private buildSession(isAuthenticated: boolean): AuthSession {
    const realmRoles = keycloak.tokenParsed?.realm_access?.roles;

    return {
      isAuthenticated,
      isLoading: false,
      username: keycloak.tokenParsed?.preferred_username ?? null,
      accessToken: keycloak.token ?? null,
      roles: Array.isArray(realmRoles) ? realmRoles : []
    };
  }

  async initialize(): Promise<AuthSession> {
    const isAuthenticated = await keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256"
    });

    return this.buildSession(isAuthenticated);
  }

  async login() {
    await keycloak.login();
  }

  async logout() {
    await keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  async refreshToken() {
    if (!keycloak.authenticated) {
      return null;
    }

    await keycloak.updateToken(30);
    return keycloak.token ?? null;
  }

  getSessionSnapshot(): AuthSession {
    return this.buildSession(Boolean(keycloak.authenticated));
  }
}
