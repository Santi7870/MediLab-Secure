from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.entities.lab_result import LabResult, LabResultDraft
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

    def create(self, draft: LabResultDraft) -> LabResult:
        model = LabResultModel(
            patient_id=draft.patient_id,
            test_name=draft.test_name,
            result_value=draft.result_value,
            unit=draft.unit,
            reference_range=draft.reference_range,
            status=draft.status,
            collected_at=draft.collected_at,
        )
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return map_lab_result_model(model)

    def update(self, lab_result_id: int, draft: LabResultDraft) -> LabResult | None:
        model = self._session.get(LabResultModel, lab_result_id)
        if model is None:
            return None

        model.patient_id = draft.patient_id
        model.test_name = draft.test_name
        model.result_value = draft.result_value
        model.unit = draft.unit
        model.reference_range = draft.reference_range
        model.status = draft.status
        model.collected_at = draft.collected_at
        self._session.commit()
        self._session.refresh(model)
        return map_lab_result_model(model)

    def delete(self, lab_result_id: int) -> bool:
        model = self._session.get(LabResultModel, lab_result_id)
        if model is None:
            return False

        self._session.delete(model)
        self._session.commit()
        return True
