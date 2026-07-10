import type { AuthSession } from "../../domain/models/AuthSession";
import { keycloak } from "../../infrastructure/auth/keycloak";

const systemBRoleMap: Record<string, string> = {
  admin: "lab-admin",
  doctor: "lab-clinician",
  laboratory: "lab-operator",
  auditor: "quality-auditor"
};

export class AuthService {
  private mapAppRoles(realmRoles: string[]) {
    return realmRoles.flatMap((role) => (systemBRoleMap[role] ? [systemBRoleMap[role]] : []));
  }

  private buildSession(isAuthenticated: boolean): AuthSession {
    const realmRoles = Array.isArray(keycloak.tokenParsed?.realm_access?.roles)
      ? keycloak.tokenParsed?.realm_access?.roles
      : [];
    const clientRoles = keycloak.tokenParsed?.resource_access?.[keycloak.clientId ?? ""]?.roles;

    return {
      isAuthenticated,
      isLoading: false,
      username: keycloak.tokenParsed?.preferred_username ?? null,
      accessToken: keycloak.token ?? null,
      roles:
        Array.isArray(clientRoles) && clientRoles.length > 0
          ? clientRoles
          : this.mapAppRoles(realmRoles),
      realmRoles,
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
