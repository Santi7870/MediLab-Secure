export interface LabResult {
  id: number;
  patientId: number;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  status: string;
  collectedAt: string;
}
