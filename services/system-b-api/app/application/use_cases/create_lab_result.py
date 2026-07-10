from app.domain.entities.lab_result import LabResult, LabResultDraft
from app.domain.repositories.lab_result_repository import LabResultRepository


class CreateLabResultUseCase:
    def __init__(self, lab_result_repository: LabResultRepository):
        self._lab_result_repository = lab_result_repository

    def execute(self, draft: LabResultDraft) -> LabResult:
        return self._lab_result_repository.create(draft)
