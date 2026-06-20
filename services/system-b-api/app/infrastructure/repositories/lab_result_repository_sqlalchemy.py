from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.entities.lab_result import LabResult
from app.domain.repositories.lab_result_repository import LabResultRepository
from app.infrastructure.database.models import LabResultModel
from app.infrastructure.mappers.lab_result_mapper import map_lab_result_model


class SqlAlchemyLabResultRepository(LabResultRepository):
    def __init__(self, session: Session):
        self._session = session

    def list_by_patient(self, patient_id: int) -> list[LabResult]:
        models = self._session.scalars(
            select(LabResultModel)
            .where(LabResultModel.patient_id == patient_id)
            .order_by(LabResultModel.collected_at.desc())
        ).all()
        return [map_lab_result_model(model) for model in models]
