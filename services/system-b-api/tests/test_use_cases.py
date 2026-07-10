from datetime import datetime, timezone

from app.application.use_cases.create_lab_result import CreateLabResultUseCase
from app.application.use_cases.delete_lab_result import DeleteLabResultUseCase
from app.application.use_cases.get_lab_results import GetLabResultsUseCase
from app.application.use_cases.update_lab_result import UpdateLabResultUseCase
from app.domain.entities.lab_result import LabResult, LabResultDraft
from app.domain.services.lab_result_errors import LabResultNotFoundError


class FakeLabResultRepository:
    def __init__(self):
        self._results = {
            1: LabResult(
                id=1,
                patient_id=1,
                test_name="Glucose",
                result_value="98",
                unit="mg/dL",
                reference_range="70-100",
                status="Normal",
                collected_at=datetime(2026, 6, 18, 12, 0, tzinfo=timezone.utc),
            )
        }
        self._next_id = 2

    def list_by_patient(self, patient_id: int):
        return [result for result in self._results.values() if result.patient_id == patient_id]

    def create(self, draft: LabResultDraft):
        result = LabResult(
            id=self._next_id,
            patient_id=draft.patient_id,
            test_name=draft.test_name,
            result_value=draft.result_value,
            unit=draft.unit,
            reference_range=draft.reference_range,
            status=draft.status,
            collected_at=draft.collected_at,
        )
        self._results[self._next_id] = result
        self._next_id += 1
        return result

    def update(self, lab_result_id: int, draft: LabResultDraft):
        if lab_result_id not in self._results:
            return None
        result = LabResult(
            id=lab_result_id,
            patient_id=draft.patient_id,
            test_name=draft.test_name,
            result_value=draft.result_value,
            unit=draft.unit,
            reference_range=draft.reference_range,
            status=draft.status,
            collected_at=draft.collected_at,
        )
        self._results[lab_result_id] = result
        return result

    def delete(self, lab_result_id: int):
        if lab_result_id not in self._results:
            return False
        del self._results[lab_result_id]
        return True


def _sample_draft() -> LabResultDraft:
    return LabResultDraft(
        patient_id=2,
        test_name="Platelets",
        result_value="240",
        unit="10^3/uL",
        reference_range="150-450",
        status="Normal",
        collected_at=datetime(2026, 6, 19, 8, 30, tzinfo=timezone.utc),
    )


def test_get_lab_results_returns_lab_records():
    use_case = GetLabResultsUseCase(FakeLabResultRepository())
    results = use_case.execute(1)

    assert len(results) == 1
    assert results[0].status == "Normal"


def test_create_lab_result_returns_persisted_result():
    use_case = CreateLabResultUseCase(FakeLabResultRepository())
    result = use_case.execute(_sample_draft())

    assert result.id == 2
    assert result.test_name == "Platelets"


def test_update_lab_result_raises_when_result_does_not_exist():
    use_case = UpdateLabResultUseCase(FakeLabResultRepository())

    try:
        use_case.execute(99, _sample_draft())
        assert False, "Expected LabResultNotFoundError"
    except LabResultNotFoundError:
        assert True


def test_delete_lab_result_raises_when_result_does_not_exist():
    use_case = DeleteLabResultUseCase(FakeLabResultRepository())

    try:
        use_case.execute(99)
        assert False, "Expected LabResultNotFoundError"
    except LabResultNotFoundError:
        assert True
