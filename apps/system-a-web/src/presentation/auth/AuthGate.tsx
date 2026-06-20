import { useAuth } from "./AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="auth-screen">Initializing secure session...</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="eyebrow">Identity Gateway</p>
          <h1>Sign in with Keycloak</h1>
          <p className="supporting-text dark-text">
            Centralized sign-in is handled by Keycloak. Plan 3 adds role checks, SSO
            continuity, and OTP enrollment policy.
          </p>
          <button className="primary-action" onClick={() => void auth.login()} type="button">
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
