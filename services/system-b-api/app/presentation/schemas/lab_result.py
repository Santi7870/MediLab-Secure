from datetime import datetime

from pydantic import BaseModel, Field


class LabResultMutationRequest(BaseModel):
    patient_id: int = Field(gt=0)
    test_name: str = Field(min_length=1, max_length=120)
    result_value: str = Field(min_length=1, max_length=30)
    unit: str = Field(min_length=1, max_length=20)
    reference_range: str = Field(min_length=1, max_length=40)
    status: str = Field(min_length=1, max_length=20)
    collected_at: datetime


class LabResultResponse(BaseModel):
    id: int
    patient_id: int
    test_name: str
    result_value: str
    unit: str
    reference_range: str
    status: str
    collected_at: datetime
