import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const auth = useAuth();
  const isAdmin = auth.roles.includes("portal-admin");
  const isLaboratory = auth.roles.includes("result-coordinator");
  const isDoctor = auth.roles.includes("clinical-operator");
  const isAuditor = auth.roles.includes("compliance-reviewer");
  const primaryRoute =
    isLaboratory && !isDoctor && !isAdmin && !isAuditor ? "/laboratory" : "/patients";
  const primaryLabel =
    isLaboratory && !isDoctor && !isAdmin && !isAuditor
      ? "Abrir validación de resultados"
      : "Abrir registro de pacientes";

  return (
    <section className="page-stack">
      <header className="hero">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h2>Coordinaci?n clínica con identidad centralizada</h2>
          <p className="content-supporting-text hero-note">
            Sistema A concentra la atención operativa, el acceso al registro de pacientes y la consulta segura de resultados
            generados por el Sistema B bajo una misma sesión corporativa.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-action" to={primaryRoute}>
            {primaryLabel}
          </Link>
          <Link className="secondary-action" to="/laboratory">
            Revisar laboratorio
          </Link>
        </div>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <span className="kpi-label">Identidad</span>
          <strong className="kpi-value">Keycloak + SSO</strong>
          <p>Sesión única entre portales con control de autenticación y trazabilidad del acceso.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Integración</span>
          <strong className="kpi-value">Sistema A - Sistema B</strong>
          <p>El portal clínico consume resultados del laboratorio sin exponer edición directa desde esta aplicación.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Protección</span>
          <strong className="kpi-value">Roles + Vault Transit</strong>
          <p>La autorización por perfil y el cifrado del intercambio protegen el flujo médico interno.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Accesos operativos</h3>
          <span>Disponibles según su perfil en Sistema A</span>
        </div>
        <div className="role-grid">
          {(isDoctor || isAdmin || isAuditor) && (
            <article className="metric-card">
              <h3>Gestión de pacientes</h3>
              <p>Consulta de usuarios clínicos, historial básico y acceso al detalle de resultados consolidados.</p>
              <Link className="button-link" to="/patients">
                Ingresar a pacientes
              </Link>
            </article>
          )}

          {(isLaboratory || isAdmin || isDoctor || isAuditor) && (
            <article className="metric-card">
              <h3>Consulta de laboratorio</h3>
              <p>Acceso controlado a resultados por identificador de paciente, con validación de roles en ambos sistemas.</p>
              <Link className="button-link" to="/laboratory">
                Ingresar a laboratorio
              </Link>
            </article>
          )}

          {isAdmin && (
            <article className="metric-card">
              <h3>Gobierno de seguridad</h3>
              <p>Revisión de perfiles, sesión unificada, federación y evidencia del flujo cifrado entre aplicaciones.</p>
              <Link className="button-link" to="/admin">
                Abrir administración
              </Link>
            </article>
          )}
        </div>
      </section>
    </section>
  );
}
