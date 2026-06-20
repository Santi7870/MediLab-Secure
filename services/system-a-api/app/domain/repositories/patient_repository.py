from abc import ABC, abstractmethod

from app.domain.entities.patient import Patient


class PatientRepository(ABC):
    @abstractmethod
    def list_patients(self) -> list[Patient]:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, patient_id: int) -> Patient | None:
        raise NotImplementedError
