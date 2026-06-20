from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class LabResult:
    id: int
    patient_id: int
    test_name: str
    result_value: str
    unit: str
    reference_range: str
    status: str
    collected_at: datetime
