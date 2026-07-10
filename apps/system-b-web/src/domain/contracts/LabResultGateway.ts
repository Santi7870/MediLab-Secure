import type { LabResult, LabResultDraft } from "../models/LabResult";

export interface LabResultGateway {
  getLabResults(patientId: number): Promise<LabResult[]>;
  createLabResult(draft: LabResultDraft): Promise<LabResult>;
  updateLabResult(labResultId: number, draft: LabResultDraft): Promise<LabResult>;
  deleteLabResult(labResultId: number): Promise<void>;
}
