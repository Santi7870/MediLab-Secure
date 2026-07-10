import type { LabResult } from "../../domain/models/LabResult";

interface LabResultsTableProps {
  results: LabResult[];
}

const getStatusClassName = (status: string) => `status-${status.toLowerCase().replace(/\s+/g, "-")}`;

export function LabResultsTable({ results }: LabResultsTableProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Resultados de laboratorio</h2>
        <span>{results.length} elementos</span>
      </div>
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
                <td>{new Date(result.collectedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
