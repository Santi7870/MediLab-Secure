import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppLayout() {
  const auth = useAuth();
  const roleLabel = auth.roles.length > 0 ? auth.roles.join(", ") : "No assigned roles";

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">MediLab Secure</p>
          <h1>System A Portal</h1>
          <p className="supporting-text">
            Centralized identity, role-based access, and OTP-ready secure medical access.
          </p>
          <div className="identity-card">
            <span>Signed in as</span>
            <strong>{auth.username ?? "Unknown user"}</strong>
            <span>Roles</span>
            <strong>{roleLabel}</strong>
            <span>Session model</span>
            <strong>SSO via Keycloak realm session</strong>
            <button
              className="secondary-action sidebar-action"
              onClick={() => void auth.logout()}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          {(auth.roles.includes("doctor") ||
            auth.roles.includes("admin") ||
            auth.roles.includes("auditor")) && <NavLink to="/patients">Patients</NavLink>}
          {(auth.roles.includes("laboratory") ||
            auth.roles.includes("admin") ||
            auth.roles.includes("doctor") ||
            auth.roles.includes("auditor")) && (
            <NavLink to="/laboratory">Laboratory</NavLink>
          )}
          {auth.roles.includes("admin") && <NavLink to="/admin">Admin</NavLink>}
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
