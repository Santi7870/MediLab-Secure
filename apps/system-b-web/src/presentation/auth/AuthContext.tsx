import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "../../application/services/AuthService";
import type { AuthSession } from "../../domain/models/AuthSession";

interface AuthContextValue extends AuthSession {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const initialSession: AuthSession = {
  isAuthenticated: false,
  isLoading: true,
  username: null,
  accessToken: null,
  roles: [],
  realmRoles: []
};

const authService = new AuthService();
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(initialSession);

  useEffect(() => {
    authService
      .initialize()
      .then(setSession)
      .catch(() =>
        setSession({
          isAuthenticated: false,
          isLoading: false,
          username: null,
          accessToken: null,
          roles: [],
          realmRoles: []
        })
      );
  }, []);

  const login = useCallback(() => authService.login(), []);
  const logout = useCallback(() => authService.logout(), []);

  const getAccessToken = useCallback(async () => {
    const token = await authService.refreshToken();
    setSession(authService.getSessionSnapshot());
    return token;
  }, []);

  const value = useMemo(
    () => ({
      ...session,
      login,
      logout,
      getAccessToken
    }),
    [getAccessToken, login, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
