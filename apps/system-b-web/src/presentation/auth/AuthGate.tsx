import { useAuth } from "./AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="auth-screen">Inicializando sesi?n compartida...</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="eyebrow">Acceso corporativo</p>
          <h1>Ingreso al Portal de Laboratorio</h1>
          <p className="supporting-text dark-text">
            El acceso se gestiona con Keycloak y reutiliza la misma sesi?n del Portal A para demostrar SSO entre dos
            aplicaciones distintas.
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
