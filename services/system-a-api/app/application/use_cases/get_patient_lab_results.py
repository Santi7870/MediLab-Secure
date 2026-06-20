from app.domain.entities.lab_result import LabResult
from app.domain.repositories.patient_repository import PatientRepository
from app.domain.services.errors import PatientNotFoundError
from app.domain.services.lab_result_gateway import LabResultGateway


class GetPatientLabResultsUseCase:
    def __init__(
        self,
        patient_repository: PatientRepository,
        lab_result_gateway: LabResultGateway,
    ):
        self._patient_repository = patient_repository
        self._lab_result_gateway = lab_result_gateway

    async def execute(self, patient_id: int, access_token: str | None = None) -> list[LabResult]:
        patient = self._patient_repository.get_by_id(patient_id)
        if patient is None:
            raise PatientNotFoundError(f"Patient {patient_id} not found.")

        return await self._lab_result_gateway.get_lab_results(patient_id, access_token)
