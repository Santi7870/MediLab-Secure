import { useEffect, useMemo, useState } from "react";
import { LabResultQueryService } from "../../application/services/LabResultQueryService";
import type { LabResult } from "../../domain/models/LabResult";
import { resolveSystemBBaseUrl } from "../../infrastructure/api/resolveApiBaseUrl";
import { SystemBApiGateway } from "../../infrastructure/api/SystemBApiGateway";
import { useAuth } from "../auth/AuthContext";
import { LabResultsTable } from "../components/LabResultsTable";

export function LabLookupPage() {
  const { getAccessToken, realmRoles } = useAuth();
  const [patientId, setPatientId] = useState("1");
  const [requestedPatientId, setRequestedPatientId] = useState<number | null>(1);
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryService = useMemo(
    () => new LabResultQueryService(new SystemBApiGateway(resolveSystemBBaseUrl(), getAccessToken)),
    [getAccessToken]
  );

  useEffect(() => {
    if (requestedPatientId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    queryService
      .getLabResults(requestedPatientId)
      .then(setResults)
      .catch((requestError: Error) => {
        setResults([]);
        setError(requestError.message);
      })
      .finally(() => setLoading(false));
  }, [queryService, requestedPatientId]);

  return (
    <section className="page-stack">
      <header className="page-header-inline">
        <div>
          <p className="eyebrow">Consulta clínica</p>
          <h2>Consulta directa de resultados</h2>
          <p className="content-supporting-text">
            Perfiles clínicos compartidos en sesión: {realmRoles.join(", ") || "sin asignación"}.
          </p>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h3>B?squeda por paciente</h3>
          <span>Utilice identificadores de ejemplo: 1, 2 o 3</span>
        </div>
        <form
          className="inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            const id = Number(patientId);
            if (!Number.isFinite(id) || id <= 0) {
              setRequestedPatientId(null);
              setResults([]);
              setError("Ingrese un identificador numérico válido.");
              setLoading(false);
              return;
            }
            setRequestedPatientId(id);
          }}
        >
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
            Consultar en Sistema B
          </button>
        </form>
      </section>

      {loading && <div className="state-panel">Cargando resultados del laboratorio...</div>}
      {error && <div className="state-panel error-state">{error}</div>}
      {!loading && !error && results.length === 0 && (
        <div className="state-panel">El paciente seleccionado no registra resultados cargados.</div>
      )}
      {!loading && !error && results.length > 0 && <LabResultsTable results={results} />}
    </section>
  );
}
