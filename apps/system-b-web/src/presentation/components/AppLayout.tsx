import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const systemBRoleLabels: Record<string, string> = {
  "lab-admin": "Administrador de laboratorio",
  "lab-operator": "Operador de laboratorio",
  "lab-clinician": "Clínico consultor",
  "quality-auditor": "Auditor de calidad"
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
  const appRoleLabel = formatRoles(auth.roles, systemBRoleLabels, "Sin perfil asignado");
  const realmRoleLabel = formatRoles(auth.realmRoles, realmRoleLabels, "Sin rol clínico compartido");
  const systemAUrl =
    typeof window !== "undefined" ? `http://${window.location.hostname}:5173` : "http://127.0.0.1:5173";

  return (
    <div className="shell shell-b">
      <aside className="sidebar">
        <div className="shell-header">
          <div className="brand-block">
            <p className="eyebrow">MediLab Secure</p>
            <h1>Portal de Laboratorio B</h1>
            <p className="supporting-text">
              Operación especializada de resultados, control de calidad y administración directa del laboratorio.
            </p>
          </div>

          <div className="identity-card">
            <div className="identity-grid">
              <div className="identity-item">
                <span>Usuario</span>
                <strong>{auth.username ?? "No identificado"}</strong>
              </div>
              <div className="identity-item">
                <span>Perfil en Sistema B</span>
                <strong>{appRoleLabel}</strong>
              </div>
              <div className="identity-item">
                <span>Rol clínico compartido</span>
                <strong>{realmRoleLabel}</strong>
              </div>
              <div className="identity-item">
                <span>Sesión</span>
                <strong>SSO reutilizado desde Sistema A</strong>
              </div>
            </div>
            <a className="button-link sidebar-action" href={systemAUrl}>
              Ir al Portal Clínico A
            </a>
            <button className="secondary-action sidebar-action" onClick={() => void auth.logout()} type="button">
              Cerrar sesión
            </button>
          </div>
        </div>

        <nav className="nav-links" aria-label="Navegación principal del sistema B">
          <p className="nav-section-title">Módulos</p>
          <NavLink to="/" end>
            Resumen ejecutivo
          </NavLink>
          <NavLink to="/lookup">Consulta de resultados</NavLink>
          {(auth.roles.includes("lab-admin") || auth.roles.includes("lab-operator")) && (
            <NavLink to="/operations">Operación y mantenimiento</NavLink>
          )}
          {(auth.roles.includes("lab-admin") || auth.roles.includes("quality-auditor")) && (
            <NavLink to="/oversight">Supervisión y evidencia</NavLink>
          )}
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
