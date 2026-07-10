import type { LabResultGateway } from "../../domain/contracts/LabResultGateway";
import type { LabResult, LabResultDraft } from "../../domain/models/LabResult";
import { mapLabResultDraftToDto, mapLabResultDto } from "../mappers/apiMappers";

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

export class SystemBApiGateway implements LabResultGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly getAccessToken: () => Promise<string | null>
  ) {}

  private async buildHeaders(includeJson = false) {
    const token = await this.getAccessToken();
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  private async buildErrorMessage(response: Response, fallback: string) {
    try {
      const payload = (await response.json()) as { detail?: string };
      return payload.detail ?? fallback;
    } catch {
      return fallback;
    }
  }

  async getLabResults(patientId: number): Promise<LabResult[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/lab-results/${patientId}`, {
      headers: await this.buildHeaders()
    });

    if (response.status === 404) {
      throw new Error("Patient not found.");
    }

    if (response.status === 401) {
      throw new Error("Authentication required.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to use the System B laboratory portal.");
    }

    if (!response.ok) {
      throw new Error(await this.buildErrorMessage(response, "Unable to load laboratory results from System B."));
    }

    const payload = (await response.json()) as LabResultDto[];
    return payload.map(mapLabResultDto);
  }

  async createLabResult(draft: LabResultDraft): Promise<LabResult> {
    const response = await fetch(`${this.baseUrl}/api/v1/lab-results`, {
      method: "POST",
      headers: await this.buildHeaders(true),
      body: JSON.stringify(mapLabResultDraftToDto(draft))
    });

    if (response.status === 401) {
      throw new Error("Authentication required.");
    }

    if (response.status === 403) {
      throw new Error("Only laboratory operators and administrators can create results.");
    }

    if (!response.ok) {
      throw new Error(await this.buildErrorMessage(response, "Unable to create laboratory result."));
    }

    return mapLabResultDto((await response.json()) as LabResultDto);
  }

  async updateLabResult(labResultId: number, draft: LabResultDraft): Promise<LabResult> {
    const response = await fetch(`${this.baseUrl}/api/v1/lab-results/${labResultId}`, {
      method: "PUT",
      headers: await this.buildHeaders(true),
      body: JSON.stringify(mapLabResultDraftToDto(draft))
    });

    if (response.status === 401) {
      throw new Error("Authentication required.");
    }

    if (response.status === 403) {
      throw new Error("Only laboratory operators and administrators can update results.");
    }

    if (response.status === 404) {
      throw new Error("Laboratory result not found.");
    }

    if (!response.ok) {
      throw new Error(await this.buildErrorMessage(response, "Unable to update laboratory result."));
    }

    return mapLabResultDto((await response.json()) as LabResultDto);
  }

  async deleteLabResult(labResultId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/lab-results/${labResultId}`, {
      method: "DELETE",
      headers: await this.buildHeaders()
    });

    if (response.status === 401) {
      throw new Error("Authentication required.");
    }

    if (response.status === 403) {
      throw new Error("Only laboratory operators and administrators can delete results.");
    }

    if (response.status === 404) {
      throw new Error("Laboratory result not found.");
    }

    if (!response.ok) {
      throw new Error(await this.buildErrorMessage(response, "Unable to delete laboratory result."));
    }
  }
}
