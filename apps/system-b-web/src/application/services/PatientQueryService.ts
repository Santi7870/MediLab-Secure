import type { PatientGateway } from "../../domain/contracts/PatientGateway";

export class PatientQueryService {
  constructor(private readonly gateway: PatientGateway) {}

  getPatients() {
    return this.gateway.getPatients();
  }

  getLabResults(patientId: number) {
    return this.gateway.getLabResults(patientId);
  }
}
