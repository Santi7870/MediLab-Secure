import type { LabResult } from "../../domain/models/LabResult";

interface LabResultsTableProps {
  results: LabResult[];
}

export function LabResultsTable({ results }: LabResultsTableProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Laboratory Results</h2>
        <span>{results.length} items</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Collected At</th>
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
                  <span className={`status-chip status-${result.status.toLowerCase()}`}>
                    {result.status}
                  </span>
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
