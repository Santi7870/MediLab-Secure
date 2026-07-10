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
        <p className="eyebrow">Control de acceso</p>
        <h2>Acceso restringido</h2>
        <p className="content-supporting-text">
          El perfil actual no dispone de autorizaciÃ³n para ingresar a este mÃ³dulo del laboratorio.
        </p>
      </header>

      <div className="state-panel error-state">
        <strong>Perfiles actuales:</strong> {auth.roles.join(", ") || "sin asignaciÃ³n"}
        <br />
        <strong>Perfiles permitidos:</strong> {allowedRoles.join(", ")}
      </div>

      <div>
        <Link className="secondary-action" to="/">
          Volver al panel principal
        </Link>
      </div>
    </section>
  );
}
