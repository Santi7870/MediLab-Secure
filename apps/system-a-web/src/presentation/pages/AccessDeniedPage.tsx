import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface AccessDeniedPageProps {
  allowedRoles: string[];
}

export function AccessDeniedPage({ allowedRoles }: AccessDeniedPageProps) {
  const auth = useAuth();

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Authorization</p>
        <h2>Access denied</h2>
        <p className="supporting-text content-supporting-text">
          Your current role does not grant access to this clinical workflow.
        </p>
      </header>

      <div className="state-panel error-state">
        <strong>Current roles:</strong> {auth.roles.join(", ") || "none"}
        <br />
        <strong>Allowed roles:</strong> {allowedRoles.join(", ")}
      </div>

      <div>
        <Link className="secondary-action" to="/">
          Return to dashboard
        </Link>
      </div>
    </section>
  );
}
