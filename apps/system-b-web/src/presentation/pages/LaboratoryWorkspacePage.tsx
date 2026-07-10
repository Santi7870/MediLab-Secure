import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LaboratoryWorkspacePage() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("1");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedId = Number(patientId);

    if (Number.isFinite(normalizedId) && normalizedId > 0) {
      navigate(`/patients/${normalizedId}/lab-results`);
    }
  };

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Laboratory</p>
        <h2>Laboratory validation workspace</h2>
        <p className="supporting-text content-supporting-text">
          This role-specific area gives laboratory staff a direct path to clinical
          results review without exposing the broader patient listing workflow.
        </p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h3>Direct result lookup</h3>
          <span>Authorized for laboratory, admin, auditor, and doctor roles</span>
        </div>
        <form className="inline-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Patient identifier</span>
            <input
              className="text-input"
              inputMode="numeric"
              onChange={(event) => setPatientId(event.target.value)}
              type="text"
              value={patientId}
            />
          </label>
          <button className="primary-action" type="submit">
            Open lab results
          </button>
        </form>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <h3>Lookup mode</h3>
          <p>Direct patient search for result validation and handoff.</p>
        </article>
        <article className="metric-card">
          <h3>Access model</h3>
          <p>Restricted from the patient registry view while still allowed to inspect results.</p>
        </article>
        <article className="metric-card">
          <h3>Security path</h3>
          <p>Bearer token validated in System A and again in System B.</p>
        </article>
      </section>
    </section>
  );
}
