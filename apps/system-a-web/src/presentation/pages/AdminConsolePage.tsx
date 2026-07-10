export function AdminConsolePage() {
  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Administración</p>
        <h2>Gobierno de seguridad y control institucional</h2>
        <p className="content-supporting-text">
          Espacio reservado para revisión ejecutiva de identidad, autorización, federación y evidencia del flujo seguro
          implementado en MediLab Secure.
        </p>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <span className="kpi-label">Identidad</span>
          <strong className="kpi-value">Keycloak</strong>
          <p>Inicio de sesión centralizado, emisión de tokens y sesión única compartida entre portales.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Autorización</span>
          <strong className="kpi-value">RBAC</strong>
          <p>Los sistemas A y B controlan el acceso por perfil y responden con denegaci?n controlada cuando aplica.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Segundo factor</span>
          <strong className="kpi-value">TOTP</strong>
          <p>Los usuarios de demostraci?n pueden enrolar OTP como evidencia de fortalecimiento del acceso.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Matriz de acceso vigente</h3>
          <span>Revisión funcional por rol clínico</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rol</th>
                <th>Pacientes</th>
                <th>Resultados</th>
                <th>Administración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Administrador</td>
                <td>Permitido</td>
                <td>Permitido</td>
                <td>Permitido</td>
              </tr>
              <tr>
                <td>Médico</td>
                <td>Permitido</td>
                <td>Permitido</td>
                <td>Restringido</td>
              </tr>
              <tr>
                <td>Laboratorio</td>
                <td>Restringido</td>
                <td>Permitido</td>
                <td>Restringido</td>
              </tr>
              <tr>
                <td>Auditor</td>
                <td>Permitido</td>
                <td>Permitido</td>
                <td>Restringido</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="role-grid">
        <article className="metric-card">
          <h3>Federación de usuarios</h3>
          <p>OpenLDAP opera como fuente externa para usuarios federados administrados desde Keycloak.</p>
        </article>
        <article className="metric-card">
          <h3>Evidencia criptográfica</h3>
          <p>Vault Transit protege el intercambio A - B sin almacenar directamente la información clínica.</p>
        </article>
        <article className="metric-card">
          <h3>Separaci?n de aplicaciones</h3>
          <p>El Portal A consulta y coordina; el Portal B administra resultados de laboratorio especializados.</p>
        </article>
      </section>
    </section>
  );
}
