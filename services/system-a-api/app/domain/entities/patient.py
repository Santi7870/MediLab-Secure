from dataclasses import dataclass


@dataclass(frozen=True)
class Patient:
    id: int
    full_name: str
    document_number: str
