from abc import ABC, abstractmethod

from app.domain.entities.lab_result import LabResult, LabResultDraft


class LabResultRepository(ABC):
    @abstractmethod
    def list_by_patient(self, patient_id: int) -> list[LabResult]:
        raise NotImplementedError

    @abstractmethod
    def create(self, draft: LabResultDraft) -> LabResult:
        raise NotImplementedError

    @abstractmethod
    def update(self, lab_result_id: int, draft: LabResultDraft) -> LabResult | None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, lab_result_id: int) -> bool:
        raise NotImplementedError
