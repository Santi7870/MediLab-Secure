from datetime import datetime

from app.domain.entities.lab_result import LabResult


def map_lab_result_payload(payload: dict) -> LabResult:
    return LabResult(
        id=payload["id"],
        patient_id=payload["patient_id"],
        test_name=payload["test_name"],
        result_value=payload["result_value"],
        unit=payload["unit"],
        reference_range=payload["reference_range"],
        status=payload["status"],
        collected_at=datetime.fromisoformat(payload["collected_at"].replace("Z", "+00:00")),
    )
