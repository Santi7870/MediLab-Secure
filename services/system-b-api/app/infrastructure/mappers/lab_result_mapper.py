from app.domain.entities.lab_result import LabResult
from app.infrastructure.database.models import LabResultModel


def map_lab_result_model(model: LabResultModel) -> LabResult:
    return LabResult(
        id=model.id,
        patient_id=model.patient_id,
        test_name=model.test_name,
        result_value=model.result_value,
        unit=model.unit,
        reference_range=model.reference_range,
        status=model.status,
        collected_at=model.collected_at,
    )
