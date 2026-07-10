import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const auth = useAuth();
  const isAdmin = auth.roles.includes("lab-admin");
  const isOperator = auth.roles.includes("lab-operator");
  const isClinician = auth.roles.includes("lab-clinician");
  const isAuditor = auth.roles.includes("quality-auditor");

  return (
    <section className="page-stack">
      <header className="hero">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h2>Operación especializada del laboratorio</h2>
          <p className="content-supporting-text hero-note">
            Sistema B administra resultados clínicos, control operativo y evidencia de integración segura dentro de la
            misma sesión corporativa compartida con el Portal A.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-action" to="/lookup">
            Consultar resultados
          </Link>
          {(isAdmin || isOperator) && (
            <Link className="secondary-action" to="/operations">
              Gestionar resultados
            </Link>
          )}
        </div>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <span className="kpi-label">Sesión</span>
          <strong className="kpi-value">SSO corporativo</strong>
          <p>La autenticación reaprovecha la sesión iniciada en Sistema A sin solicitar un segundo acceso.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Administración</span>
          <strong className="kpi-value">CRUD de resultados</strong>
          <p>El laboratorio crea, actualiza y elimina resultados directamente desde esta aplicación.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Integración</span>
          <strong className="kpi-value">API propia</strong>
          <p>El portal B consume su propia API y participa en el flujo cifrado requerido por la consigna.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Accesos operativos</h3>
          <span>Disponibles según su perfil en Sistema B</span>
        </div>
        <div className="role-grid">
          {(isAdmin || isClinician || isOperator || isAuditor) && (
            <article className="metric-card">
              <h3>Consulta clínica</h3>
              <p>B?squeda por identificador para verificar resultados directamente contra la API del laboratorio.</p>
              <Link className="button-link" to="/lookup">
                Abrir consulta
              </Link>
            </article>
          )}

          {(isAdmin || isOperator) && (
            <article className="metric-card">
              <h3>Operación</h3>
              <p>Creación y mantenimiento de resultados, con edición controlada y trazabilidad funcional.</p>
              <Link className="button-link" to="/operations">
                Abrir operación
              </Link>
            </article>
          )}

          {(isAdmin || isAuditor) && (
            <article className="metric-card">
              <h3>Supervisión</h3>
              <p>Evidencia del modelo SSO, separaci?n por roles y narrativa de cifrado con Vault Transit.</p>
              <Link className="button-link" to="/oversight">
                Abrir supervisión
              </Link>
            </article>
          )}
        </div>
      </section>
    </section>
  );
}
