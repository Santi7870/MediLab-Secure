import { useEffect, useState } from "react";
import { PatientQueryService } from "../../application/services/PatientQueryService";
import type { Patient } from "../../domain/models/Patient";
import { resolveSystemABaseUrl } from "../../infrastructure/api/resolveApiBaseUrl";
import { SystemAApiGateway } from "../../infrastructure/api/SystemAApiGateway";
import { useAuth } from "../auth/AuthContext";
import { PatientList } from "../components/PatientList";

export function PatientsPage() {
  const { getAccessToken } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const patientService = new PatientQueryService(
      new SystemAApiGateway(resolveSystemABaseUrl(), getAccessToken)
    );

    patientService
      .getPatients()
      .then(setPatients)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [getAccessToken]);

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Patients</p>
        <h2>Clinical lookup entrypoint</h2>
      </header>

      {loading && <div className="state-panel">Loading patients...</div>}
      {error && <div className="state-panel error-state">{error}</div>}
      {!loading && !error && patients.length === 0 && (
        <div className="state-panel">No patients are available.</div>
      )}
      {!loading && !error && patients.length > 0 && <PatientList patients={patients} />}
    </section>
  );
}
