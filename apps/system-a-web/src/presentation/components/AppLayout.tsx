import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const systemARoleLabels: Record<string, string> = {
  "portal-admin": "Administrador del portal",
  "clinical-operator": "Operador clínico",
  "result-coordinator": "Coordinador de resultados",
  "compliance-reviewer": "Revisor de cumplimiento"
};

const realmRoleLabels: Record<string, string> = {
  admin: "Administrador",
  doctor: "Médico",
  laboratory: "Laboratorio",
  auditor: "Auditor"
};

const formatRoles = (roles: string[], labels: Record<string, string>, emptyLabel: string) =>
  roles.length > 0 ? roles.map((role) => labels[role] ?? role).join(", ") : emptyLabel;

export function AppLayout() {
  const auth = useAuth();
  const appRoleLabel = formatRoles(auth.roles, systemARoleLabels, "Sin perfil asignado");
  const realmRoleLabel = formatRoles(auth.realmRoles, realmRoleLabels, "Sin rol clínico compartido");
  const systemBUrl =
    typeof window !== "undefined" ? `http://${window.location.hostname}:5174` : "http://127.0.0.1:5174";

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="shell-header">
          <div className="brand-block">
            <p className="eyebrow">MediLab Secure</p>
            <h1>Portal Clínico A</h1>
            <p className="supporting-text">
              Gestión asistencial, consulta de pacientes e integración segura con el sistema de laboratorio.
            </p>
          </div>

          <div className="identity-card">
            <div className="identity-grid">
              <div className="identity-item">
                <span>Usuario</span>
                <strong>{auth.username ?? "No identificado"}</strong>
              </div>
              <div className="identity-item">
                <span>Perfil en Sistema A</span>
                <strong>{appRoleLabel}</strong>
              </div>
              <div className="identity-item">
                <span>Rol clínico compartido</span>
                <strong>{realmRoleLabel}</strong>
              </div>
              <div className="identity-item">
                <span>Sesión</span>
                <strong>SSO activo con Keycloak</strong>
              </div>
            </div>
            <a className="button-link sidebar-action" href={systemBUrl}>
              Ir al Portal de Laboratorio B
            </a>
            <button className="secondary-action sidebar-action" onClick={() => void auth.logout()} type="button">
              Cerrar sesión
            </button>
          </div>
        </div>

        <nav className="nav-links" aria-label="Navegación principal del sistema A">
          <p className="nav-section-title">Módulos</p>
          <NavLink to="/" end>
            Resumen ejecutivo
          </NavLink>
          {(auth.roles.includes("clinical-operator") ||
            auth.roles.includes("portal-admin") ||
            auth.roles.includes("compliance-reviewer")) && <NavLink to="/patients">Pacientes</NavLink>}
          {(auth.roles.includes("result-coordinator") ||
            auth.roles.includes("portal-admin") ||
            auth.roles.includes("clinical-operator") ||
            auth.roles.includes("compliance-reviewer")) && <NavLink to="/laboratory">Resultados de laboratorio</NavLink>}
          {auth.roles.includes("portal-admin") && <NavLink to="/admin">Administración</NavLink>}
        </nav>
      </aside>

      <main className="content">
        <div className="content-shell">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
