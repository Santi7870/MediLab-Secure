import type { LabResultGateway } from "../../domain/contracts/LabResultGateway";
import type { LabResultDraft } from "../../domain/models/LabResult";

export class LabResultQueryService {
  constructor(private readonly gateway: LabResultGateway) {}

  getLabResults(patientId: number) {
    return this.gateway.getLabResults(patientId);
  }

  createLabResult(draft: LabResultDraft) {
    return this.gateway.createLabResult(draft);
  }

  updateLabResult(labResultId: number, draft: LabResultDraft) {
    return this.gateway.updateLabResult(labResultId, draft);
  }

  deleteLabResult(labResultId: number) {
    return this.gateway.deleteLabResult(labResultId);
  }
}
