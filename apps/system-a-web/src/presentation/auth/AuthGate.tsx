import { useAuth } from "./AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="auth-screen">Inicializando sesi?n segura...</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="eyebrow">Acceso corporativo</p>
          <h1>Ingreso al Portal Cl?nico</h1>
          <p className="supporting-text dark-text">
            La autenticaci?n centralizada se realiza con Keycloak para habilitar sesi?n ?nica, control por roles y
            continuidad entre los portales A y B.
          </p>
          <button className="primary-action" onClick={() => void auth.login()} type="button">
            Iniciar sesi?n
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
