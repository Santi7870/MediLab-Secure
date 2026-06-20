from app.domain.entities.patient import Patient
from app.domain.repositories.patient_repository import PatientRepository


class ListPatientsUseCase:
    def __init__(self, patient_repository: PatientRepository):
        self._patient_repository = patient_repository

    def execute(self) -> list[Patient]:
        return self._patient_repository.list_patients()
