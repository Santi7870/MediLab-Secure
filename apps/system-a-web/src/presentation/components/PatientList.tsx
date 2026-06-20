import { Link } from "react-router-dom";
import type { Patient } from "../../domain/models/Patient";

interface PatientListProps {
  patients: Patient[];
}

export function PatientList({ patients }: PatientListProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Registered Patients</h2>
        <span>{patients.length} records</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.fullName}</td>
                <td>{patient.documentNumber}</td>
                <td>
                  <Link className="button-link" to={`/patients/${patient.id}/lab-results`}>
                    View lab results
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
