export function AdminConsolePage() {
  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Administration</p>
        <h2>Security administration console</h2>
        <p className="supporting-text content-supporting-text">
          This workspace is reserved for administrative review of identity controls,
          role coverage, and the security posture enabled in Plans 2 and 3.
        </p>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <h3>Identity</h3>
          <p>Keycloak centralizes login, token issuance, and single realm session state.</p>
        </article>
        <article className="metric-card">
          <h3>Authorization</h3>
          <p>System A and System B reject unauthorized roles with controlled `403` responses.</p>
        </article>
        <article className="metric-card">
          <h3>MFA policy</h3>
          <p>Demo users are forced to enroll TOTP through the `CONFIGURE_TOTP` action.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Role governance matrix</h3>
          <span>Current implementation</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Patients</th>
                <th>Lab results</th>
                <th>Admin console</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin</td>
                <td>Allowed</td>
                <td>Allowed</td>
                <td>Allowed</td>
              </tr>
              <tr>
                <td>doctor</td>
                <td>Allowed</td>
                <td>Allowed</td>
                <td>Denied</td>
              </tr>
              <tr>
                <td>laboratory</td>
                <td>Denied</td>
                <td>Allowed</td>
                <td>Denied</td>
              </tr>
              <tr>
                <td>auditor</td>
                <td>Allowed</td>
                <td>Allowed</td>
                <td>Denied</td>
              </tr>
              <tr>
                <td>patient</td>
                <td>Denied</td>
                <td>Denied</td>
                <td>Denied</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <h3>Federation source</h3>
          <p>OpenLDAP directory exposed through Keycloak user federation.</p>
        </article>
        <article className="metric-card">
          <h3>Federated users</h3>
          <p>`federated.lab` and `federated.auditor` authenticate from LDAP with the same OTP policy.</p>
        </article>
        <article className="metric-card">
          <h3>Encrypted A to B flow</h3>
          <p>System A encrypts the request with Vault Transit and System B decrypts before processing.</p>
        </article>
      </section>
    </section>
  );
}
