from pydantic import BaseModel


class PatientResponse(BaseModel):
    id: int
    full_name: str
    document_number: str
