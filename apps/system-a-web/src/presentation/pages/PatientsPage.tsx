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
        <p className="eyebrow">Pacientes</p>
        <h2>Registro clÃ­nico de consulta</h2>
        <p className="content-supporting-text">
          Vista consolidada de pacientes habilitados para la revisiÃ³n de resultados clÃ­nicos desde el Portal A.
        </p>
      </header>

      {loading && <div className="state-panel">Cargando pacientes...</div>}
      {error && <div className="state-panel error-state">{error}</div>}
      {!loading && !error && patients.length === 0 && (
        <div className="state-panel">No existen pacientes disponibles para este perfil.</div>
      )}
      {!loading && !error && patients.length > 0 && <PatientList patients={patients} />}
    </section>
  );
}
