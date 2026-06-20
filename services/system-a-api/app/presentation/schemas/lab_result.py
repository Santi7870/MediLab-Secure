from datetime import datetime

from pydantic import BaseModel


class LabResultResponse(BaseModel):
    id: int
    patient_id: int
    test_name: str
    result_value: str
    unit: str
    reference_range: str
    status: str
    collected_at: datetime
