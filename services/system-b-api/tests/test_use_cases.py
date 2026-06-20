from datetime import datetime, timezone

from app.application.use_cases.get_lab_results import GetLabResultsUseCase
from app.domain.entities.lab_result import LabResult


class FakeLabResultRepository:
    def list_by_patient(self, patient_id: int):
        return [
            LabResult(
                id=1,
                patient_id=patient_id,
                test_name="Glucose",
                result_value="98",
                unit="mg/dL",
                reference_range="70-100",
                status="Normal",
                collected_at=datetime(2026, 6, 18, 12, 0, tzinfo=timezone.utc),
            )
        ]


def test_get_lab_results_returns_lab_records():
    use_case = GetLabResultsUseCase(FakeLabResultRepository())
    results = use_case.execute(1)

    assert len(results) == 1
    assert results[0].status == "Normal"
