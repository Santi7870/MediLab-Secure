import type { LabResult } from "../models/LabResult";
import type { Patient } from "../models/Patient";

export interface PatientGateway {
  getPatients(): Promise<Patient[]>;
  getLabResults(patientId: number): Promise<LabResult[]>;
}
