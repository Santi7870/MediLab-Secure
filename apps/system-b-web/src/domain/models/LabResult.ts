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

export interface LabResultDraft {
  patientId: number;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  status: string;
  collectedAt: string;
}

export const labResultStatuses = ["Normal", "High", "Low", "Critical", "Validated"] as const;
