import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PatientQueryService } from "../../application/services/PatientQueryService";
import type { LabResult } from "../../domain/models/LabResult";
import { resolveSystemABaseUrl } from "../../infrastructure/api/resolveApiBaseUrl";
import { SystemAApiGateway } from "../../infrastructure/api/SystemAApiGateway";
import { useAuth } from "../auth/AuthContext";
import { LabResultsTable } from "../components/LabResultsTable";

export function LabResultsPage() {
  const { getAccessToken } = useAuth();
  const { patientId } = useParams();
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const patientService = new PatientQueryService(
      new SystemAApiGateway(resolveSystemABaseUrl(), getAccessToken)
    );

    const id = Number(patientId);
    if (!Number.isFinite(id)) {
      setError("Invalid patient identifier.");
      setLoading(false);
      return;
    }

    patientService
      .getLabResults(id)
      .then(setResults)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [getAccessToken, patientId]);

  return (
    <section className="page-stack">
      <header className="page-header-inline">
        <div>
          <p className="eyebrow">Laboratory Results</p>
          <h2>Patient #{patientId}</h2>
        </div>
        <Link className="secondary-action" to="/patients">
          Back to patients
        </Link>
      </header>

      {loading && <div className="state-panel">Loading laboratory results...</div>}
      {error && <div className="state-panel error-state">{error}</div>}
      {!loading && !error && results.length === 0 && (
        <div className="state-panel">The selected patient has no laboratory results.</div>
      )}
      {!loading && !error && results.length > 0 && <LabResultsTable results={results} />}
    </section>
  );
}
