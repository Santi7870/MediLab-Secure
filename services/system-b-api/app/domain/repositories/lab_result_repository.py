from abc import ABC, abstractmethod

from app.domain.entities.lab_result import LabResult


class LabResultRepository(ABC):
    @abstractmethod
    def list_by_patient(self, patient_id: int) -> list[LabResult]:
        raise NotImplementedError
