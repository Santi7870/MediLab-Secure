import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function LaboratoryWorkspacePage() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("1");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedId = Number(patientId);

    if (Number.isFinite(normalizedId) && normalizedId > 0) {
      navigate(`/patients/${normalizedId}/lab-results`);
    }
  };

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Laboratorio</p>
        <h2>Validación clínica de resultados</h2>
        <p className="content-supporting-text">
          Ruta ?gil para revisar resultados sin abrir el registro completo de pacientes cuando el perfil operativo exige
          validación directa.
        </p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h3>B?squeda directa</h3>
          <span>Habilitado para laboratorio, administración, auditoría y personal clínico autorizado</span>
        </div>
        <form className="inline-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Identificador de paciente</span>
            <input
              className="text-input"
              inputMode="numeric"
              onChange={(event) => setPatientId(event.target.value)}
              type="text"
              value={patientId}
            />
          </label>
          <button className="primary-action" type="submit">
            Consultar resultados
          </button>
        </form>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <span className="kpi-label">Modo de trabajo</span>
          <strong className="kpi-value">Consulta puntual</strong>
          <p>Revisión rápida por identificador para validación y entrega de resultados.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Acceso</span>
          <strong className="kpi-value">Controlado</strong>
          <p>El perfil de laboratorio puede revisar resultados aunque no tenga acceso al padrón general.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Seguridad</span>
          <strong className="kpi-value">Token validado en A y B</strong>
          <p>La sesión se verifica en ambos extremos antes de entregar la información solicitada.</p>
        </article>
      </section>
    </section>
  );
}
