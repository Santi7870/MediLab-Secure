from app.domain.entities.patient import Patient
from app.infrastructure.database.models import PatientModel


def map_patient_model(model: PatientModel) -> Patient:
    return Patient(
        id=model.id,
        full_name=model.full_name,
        document_number=model.document_number,
    )
