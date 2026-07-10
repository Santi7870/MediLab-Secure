from app.domain.entities.lab_result import LabResult, LabResultDraft
from app.domain.repositories.lab_result_repository import LabResultRepository
from app.domain.services.lab_result_errors import LabResultNotFoundError


class UpdateLabResultUseCase:
    def __init__(self, lab_result_repository: LabResultRepository):
        self._lab_result_repository = lab_result_repository

    def execute(self, lab_result_id: int, draft: LabResultDraft) -> LabResult:
        updated_result = self._lab_result_repository.update(lab_result_id, draft)
        if updated_result is None:
            raise LabResultNotFoundError("Laboratory result not found.")
        return updated_result
