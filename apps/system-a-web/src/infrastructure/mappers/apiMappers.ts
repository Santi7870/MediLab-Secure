import type { LabResult } from "../../domain/models/LabResult";
import type { Patient } from "../../domain/models/Patient";

export const mapPatientDto = (dto: {
  id: number;
  full_name: string;
  document_number: string;
}): Patient => ({
  id: dto.id,
  fullName: dto.full_name,
  documentNumber: dto.document_number
});

export const mapLabResultDto = (dto: {
  id: number;
  patient_id: number;
  test_name: string;
  result_value: string;
  unit: string;
  reference_range: string;
  status: string;
  collected_at: string;
}): LabResult => ({
  id: dto.id,
  patientId: dto.patient_id,
  testName: dto.test_name,
  resultValue: dto.result_value,
  unit: dto.unit,
  referenceRange: dto.reference_range,
  status: dto.status,
  collectedAt: dto.collected_at
});
