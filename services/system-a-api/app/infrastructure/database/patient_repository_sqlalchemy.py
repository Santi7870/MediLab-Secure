from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.entities.patient import Patient
from app.domain.repositories.patient_repository import PatientRepository
from app.infrastructure.database.models import PatientModel
from app.infrastructure.mappers.patient_mapper import map_patient_model


class SqlAlchemyPatientRepository(PatientRepository):
    def __init__(self, session: Session):
        self._session = session

    def list_patients(self) -> list[Patient]:
        models = self._session.scalars(select(PatientModel).order_by(PatientModel.full_name)).all()
        return [map_patient_model(model) for model in models]

    def get_by_id(self, patient_id: int) -> Patient | None:
        model = self._session.get(PatientModel, patient_id)
        if model is None:
            return None
        return map_patient_model(model)
