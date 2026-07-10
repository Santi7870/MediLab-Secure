from app.domain.repositories.lab_result_repository import LabResultRepository
from app.domain.services.lab_result_errors import LabResultNotFoundError


class DeleteLabResultUseCase:
    def __init__(self, lab_result_repository: LabResultRepository):
        self._lab_result_repository = lab_result_repository

    def execute(self, lab_result_id: int) -> None:
        deleted = self._lab_result_repository.delete(lab_result_id)
        if not deleted:
            raise LabResultNotFoundError("Laboratory result not found.")
