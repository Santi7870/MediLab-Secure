import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LabResultQueryService } from "../../application/services/LabResultQueryService";
import type { LabResult, LabResultDraft } from "../../domain/models/LabResult";
import { labResultStatuses } from "../../domain/models/LabResult";
import { resolveSystemBBaseUrl } from "../../infrastructure/api/resolveApiBaseUrl";
import { SystemBApiGateway } from "../../infrastructure/api/SystemBApiGateway";
import { useAuth } from "../auth/AuthContext";

const createInitialDraft = (patientId = 1): LabResultDraft => ({
  patientId,
  testName: "",
  resultValue: "",
  unit: "",
  referenceRange: "",
  status: "Normal",
  collectedAt: new Date().toISOString().slice(0, 16)
});

const getStatusClassName = (status: string) => `status-${status.toLowerCase().replace(/\s+/g, "-")}`;

export function OperationsPage() {
  const { getAccessToken } = useAuth();
  const [patientIdInput, setPatientIdInput] = useState("1");
  const [activePatientId, setActivePatientId] = useState(1);
  const [draft, setDraft] = useState<LabResultDraft>(createInitialDraft(1));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const queryService = useMemo(
    () => new LabResultQueryService(new SystemBApiGateway(resolveSystemBBaseUrl(), getAccessToken)),
    [getAccessToken]
  );

  const reloadResults = async (patientId: number) => {
    setLoading(true);
    setError(null);
    try {
      const loadedResults = await queryService.getLabResults(patientId);
      setResults(loadedResults);
    } catch (requestError) {
      setResults([]);
      setError(requestError instanceof Error ? requestError.message : "No fue posible cargar los resultados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reloadResults(activePatientId);
  }, [queryService]);

  const resetDraft = (patientId: number) => {
    setDraft(createInitialDraft(patientId));
    setEditingId(null);
  };

  const handlePatientLoad = async () => {
    const patientId = Number(patientIdInput);
    if (!Number.isFinite(patientId) || patientId <= 0) {
      setError("Ingrese un identificador de paciente válido.");
      return;
    }

    setActivePatientId(patientId);
    resetDraft(patientId);
    setFeedback(null);
    await reloadResults(patientId);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      if (editingId === null) {
        await queryService.createLabResult(draft);
        setFeedback("Resultado creado correctamente en el Sistema B.");
      } else {
        await queryService.updateLabResult(editingId, draft);
        setFeedback("Resultado actualizado correctamente en el Sistema B.");
      }

      await reloadResults(draft.patientId);
      setPatientIdInput(String(draft.patientId));
      setActivePatientId(draft.patientId);
      resetDraft(draft.patientId);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No fue posible guardar el resultado.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (result: LabResult) => {
    setEditingId(result.id);
    setDraft({
      patientId: result.patientId,
      testName: result.testName,
      resultValue: result.resultValue,
      unit: result.unit,
      referenceRange: result.referenceRange,
      status: result.status,
      collectedAt: result.collectedAt.slice(0, 16)
    });
    setFeedback(null);
    setError(null);
  };

  const handleDelete = async (labResultId: number) => {
    const confirmed = window.confirm("¿Desea eliminar este resultado del laboratorio?");
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      await queryService.deleteLabResult(labResultId);
      await reloadResults(activePatientId);
      if (editingId === labResultId) {
        resetDraft(activePatientId);
      }
      setFeedback("Resultado eliminado correctamente del Sistema B.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No fue posible eliminar el resultado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Operación</p>
        <h2>Administración de resultados de laboratorio</h2>
        <p className="content-supporting-text">
          Este módulo diferencia claramente al Sistema B: aqu? se crean, editan y eliminan resultados clínicos que luego
          son consumidos por el Sistema A.
        </p>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <span className="kpi-label">Paciente activo</span>
          <strong className="kpi-value">#{activePatientId}</strong>
          <p>Conjunto actual de resultados bajo revisión operativa.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Registros cargados</span>
          <strong className="kpi-value">{results.length}</strong>
          <p>Total de resultados asociados al paciente seleccionado.</p>
        </article>
        <article className="metric-card">
          <span className="kpi-label">Modo</span>
          <strong className="kpi-value">{editingId === null ? "Creación" : `Edición #${editingId}`}</strong>
          <p>Estado del formulario operativo para mantenimiento de resultados.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Filtro por paciente</h3>
          <span>Cargue un conjunto antes de registrar o modificar información</span>
        </div>
        <div className="toolbar-row">
          <label className="field-group compact-field">
            <span>Identificador de paciente</span>
            <input
              className="text-input"
              inputMode="numeric"
              onChange={(event) => setPatientIdInput(event.target.value)}
              type="text"
              value={patientIdInput}
            />
          </label>
          <button className="primary-action" onClick={() => void handlePatientLoad()} type="button">
            Cargar resultados
          </button>
          <button className="secondary-action" onClick={() => resetDraft(activePatientId)} type="button">
            Nuevo resultado
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>{editingId === null ? "Registrar resultado" : `Editar resultado #${editingId}`}</h3>
          <span>Persistencia directa sobre el repositorio clínico del laboratorio</span>
        </div>
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field-group">
              <span>Identificador de paciente</span>
              <input
                className="text-input"
                inputMode="numeric"
                min="1"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, patientId: Number(event.target.value) || 0 }))
                }
                type="number"
                value={draft.patientId}
              />
            </label>
            <label className="field-group">
              <span>Nombre de la prueba</span>
              <input
                className="text-input"
                onChange={(event) => setDraft((current) => ({ ...current, testName: event.target.value }))}
                type="text"
                value={draft.testName}
              />
            </label>
            <label className="field-group">
              <span>Valor obtenido</span>
              <input
                className="text-input"
                onChange={(event) => setDraft((current) => ({ ...current, resultValue: event.target.value }))}
                type="text"
                value={draft.resultValue}
              />
            </label>
            <label className="field-group">
              <span>Unidad</span>
              <input
                className="text-input"
                onChange={(event) => setDraft((current) => ({ ...current, unit: event.target.value }))}
                type="text"
                value={draft.unit}
              />
            </label>
            <label className="field-group">
              <span>Rango de referencia</span>
              <input
                className="text-input"
                onChange={(event) => setDraft((current) => ({ ...current, referenceRange: event.target.value }))}
                type="text"
                value={draft.referenceRange}
              />
            </label>
            <label className="field-group">
              <span>Estado</span>
              <select
                className="text-input"
                onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
                value={draft.status}
              >
                {labResultStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-group">
              <span>Fecha y hora de toma</span>
              <input
                className="text-input"
                onChange={(event) => setDraft((current) => ({ ...current, collectedAt: event.target.value }))}
                type="datetime-local"
                value={draft.collectedAt}
              />
            </label>
          </div>
          <div className="action-row">
            <button className="primary-action" disabled={saving} type="submit">
              {saving ? "Guardando..." : editingId === null ? "Registrar resultado" : "Guardar cambios"}
            </button>
            <button className="secondary-action" onClick={() => resetDraft(activePatientId)} type="button">
              Cancelar edición
            </button>
          </div>
        </form>
      </section>

      {loading && <div className="state-panel">Cargando resultados del laboratorio...</div>}
      {error && <div className="state-panel error-state">{error}</div>}
      {feedback && <div className="state-panel success-state">{feedback}</div>}

      {!loading && !error && (
        <section className="panel">
          <div className="panel-header">
            <h3>Resultados administrados</h3>
            <span>Repositorio clínico del paciente #{activePatientId}</span>
          </div>
          {results.length === 0 ? (
            <div className="state-panel">No existen resultados cargados para este paciente.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Prueba</th>
                    <th>Valor</th>
                    <th>Unidad</th>
                    <th>Rango de referencia</th>
                    <th>Estado</th>
                    <th>Fecha de toma</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.testName}</td>
                      <td>{result.resultValue}</td>
                      <td>{result.unit}</td>
                      <td>{result.referenceRange}</td>
                      <td>
                        <span className={`status-chip ${getStatusClassName(result.status)}`}>{result.status}</span>
                      </td>
                      <td>{new Date(result.collectedAt).toLocaleString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="secondary-action action-button" onClick={() => handleEdit(result)} type="button">
                            Editar
                          </button>
                          <button
                            className="danger-action action-button"
                            disabled={saving}
                            onClick={() => void handleDelete(result.id)}
                            type="button"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
