from datetime import datetime

import pytest

from app.application.use_cases.get_patient_lab_results import GetPatientLabResultsUseCase
from app.application.use_cases.list_patients import ListPatientsUseCase
from app.domain.entities.lab_result import LabResult
from app.domain.entities.patient import Patient
from app.domain.services.errors import PatientNotFoundError


class FakePatientRepository:
    def __init__(self):
        self._patients = [Patient(id=1, full_name="Ana Perez", document_number="1712345678")]

    def list_patients(self):
        return self._patients

    def get_by_id(self, patient_id: int):
        return next((patient for patient in self._patients if patient.id == patient_id), None)


class FakeLabGateway:
    async def get_lab_results(self, patient_id: int, access_token: str | None = None):
        return [
            LabResult(
                id=1,
                patient_id=patient_id,
                test_name="Glucose",
                result_value="98",
                unit="mg/dL",
                reference_range="70-100",
                status="Normal",
                collected_at=datetime.fromisoformat("2026-06-18T12:00:00+00:00"),
            )
        ]


def test_list_patients_returns_registered_patients():
    use_case = ListPatientsUseCase(FakePatientRepository())
    patients = use_case.execute()

    assert len(patients) == 1
    assert patients[0].full_name == "Ana Perez"


@pytest.mark.asyncio
async def test_get_patient_lab_results_returns_results():
    use_case = GetPatientLabResultsUseCase(FakePatientRepository(), FakeLabGateway())
    results = await use_case.execute(1, "fake-token")

    assert len(results) == 1
    assert results[0].test_name == "Glucose"


@pytest.mark.asyncio
async def test_get_patient_lab_results_raises_when_patient_does_not_exist():
    use_case = GetPatientLabResultsUseCase(FakePatientRepository(), FakeLabGateway())

    with pytest.raises(PatientNotFoundError):
        await use_case.execute(999, "fake-token")
