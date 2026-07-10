import type { LabResult, LabResultDraft } from "../../domain/models/LabResult";
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

export const mapLabResultDraftToDto = (draft: LabResultDraft) => ({
  patient_id: draft.patientId,
  test_name: draft.testName,
  result_value: draft.resultValue,
  unit: draft.unit,
  reference_range: draft.referenceRange,
  status: draft.status,
  collected_at: draft.collectedAt
});
