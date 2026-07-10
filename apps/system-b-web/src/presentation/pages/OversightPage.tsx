export function OversightPage() {
  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Supervisión</p>
        <h2>Evidencia de seguridad e integración</h2>
        <p className="content-supporting-text">
          Vista orientada a revisión académica y de control para demostrar identidad compartida, separaci?n por perfiles
          y protección criptográfica en el intercambio entre sistemas.
        </p>
      </header>

      <section className="role-grid">
        <article className="metric-card">
          <span className="kpi-label">Identidad compartida</span>
          <strong className="kpi-value">Mismo realm</strong>
          <p>Los portales A y B usan clientes OIDC distintos pero comparten la misma sesión gestionada por Keycloak.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Separaci?n funcional</span>
          <strong className="kpi-value">Roles por aplicación</strong>
          <p>Cada portal traduce y aplica sus propios perfiles visibles, aunque el usuario provenga de la misma sesión.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Cifrado del flujo</span>
          <strong className="kpi-value">Vault Transit</strong>
          <p>Sistema A cifra la solicitud, Sistema B la descifra y vuelve a cifrar la respuesta antes del retorno.</p>
        </article>
      </section>
    </section>
  );
}
