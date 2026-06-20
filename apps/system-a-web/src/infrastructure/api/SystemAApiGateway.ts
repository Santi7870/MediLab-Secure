import type { PatientGateway } from "../../domain/contracts/PatientGateway";
import type { LabResult } from "../../domain/models/LabResult";
import type { Patient } from "../../domain/models/Patient";
import { mapLabResultDto, mapPatientDto } from "../mappers/apiMappers";

interface PatientDto {
  id: number;
  full_name: string;
  document_number: string;
}

interface LabResultDto {
  id: number;
  patient_id: number;
  test_name: string;
  result_value: string;
  unit: string;
  reference_range: string;
  status: string;
  collected_at: string;
}

export class SystemAApiGateway implements PatientGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly getAccessToken: () => Promise<string | null>
  ) {}

  private async buildHeaders() {
    const token = await this.getAccessToken();
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/patients`, {
      headers: await this.buildHeaders()
    });
    if (response.status === 401) {
      throw new Error("Authentication required.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to view patients.");
    }

    if (!response.ok) {
      throw new Error("Unable to load patients.");
    }

    const payload = (await response.json()) as PatientDto[];
    return payload.map(mapPatientDto);
  }

  async getLabResults(patientId: number): Promise<LabResult[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/patients/${patientId}/lab-results`, {
      headers: await this.buildHeaders()
    });

    if (response.status === 404) {
      throw new Error("Patient not found.");
    }

    if (response.status === 502) {
      throw new Error("Laboratory service is unavailable.");
    }

    if (response.status === 401) {
      throw new Error("Authentication required.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to view laboratory results.");
    }

    if (!response.ok) {
      throw new Error("Unable to load lab results.");
    }

    const payload = (await response.json()) as LabResultDto[];
    return payload.map(mapLabResultDto);
  }
}
