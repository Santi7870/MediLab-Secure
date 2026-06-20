from app.domain.entities.lab_result import LabResult
from app.domain.repositories.lab_result_repository import LabResultRepository


class GetLabResultsUseCase:
    def __init__(self, lab_result_repository: LabResultRepository):
        self._lab_result_repository = lab_result_repository

    def execute(self, patient_id: int) -> list[LabResult]:
        return self._lab_result_repository.list_by_patient(patient_id)
