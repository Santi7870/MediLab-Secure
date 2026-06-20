import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const auth = useAuth();
  const isAdmin = auth.roles.includes("admin");
  const isLaboratory = auth.roles.includes("laboratory");
  const isDoctor = auth.roles.includes("doctor");
  const isAuditor = auth.roles.includes("auditor");
  const primaryRoute =
    isLaboratory && !isDoctor && !isAdmin && !isAuditor ? "/laboratory" : "/patients";
  const primaryLabel =
    isLaboratory && !isDoctor && !isAdmin && !isAuditor
      ? "Open laboratory workspace"
      : "Open patient records";

  return (
    <section className="page-stack">
      <header className="hero">
        <div>
          <p className="eyebrow">Plan 3 Security Controls</p>
          <h2>Identity-aware clinical access for System A</h2>
          <p className="supporting-text">
            This portal now runs with centralized login in Keycloak, route access by
            role, and OTP enrollment prepared at the identity layer before the remaining
            federation and KMS work.
          </p>
        </div>
        <Link className="primary-action" to={primaryRoute}>
          {primaryLabel}
        </Link>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <h3>Authorization</h3>
          <p>Role-aware routes and backend policy enforcement</p>
        </article>
        <article className="metric-card">
          <h3>Session</h3>
          <p>Single sign-on backed by a centralized Keycloak realm</p>
        </article>
        <article className="metric-card">
          <h3>MFA</h3>
          <p>TOTP enrollment prepared as required action in Keycloak</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Role-specific workspaces</h3>
          <span>Rendered from your Keycloak role assignment</span>
        </div>
        <div className="role-grid">
          {isAdmin && (
            <article className="metric-card">
              <h3>Admin workspace</h3>
              <p>Review role governance, MFA enforcement, and access policy coverage.</p>
              <Link className="button-link" to="/admin">
                Open admin console
              </Link>
            </article>
          )}

          {isLaboratory && (
            <article className="metric-card">
              <h3>Laboratory workspace</h3>
              <p>Jump straight to patient result validation without exposing the registry view.</p>
              <Link className="button-link" to="/laboratory">
                Open laboratory workspace
              </Link>
            </article>
          )}

          {isDoctor && (
            <article className="metric-card">
              <h3>Doctor workspace</h3>
              <p>Clinical users can access the patient registry and drill into laboratory detail.</p>
              <Link className="button-link" to="/patients">
                Open patient registry
              </Link>
            </article>
          )}

          {isAuditor && (
            <article className="metric-card">
              <h3>Auditor workspace</h3>
              <p>Audit roles can inspect the same secured workflow to validate control operation.</p>
              <Link className="button-link" to="/patients">
                Review secured flow
              </Link>
            </article>
          )}
        </div>
      </section>
    </section>
  );
}
