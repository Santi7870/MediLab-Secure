from datetime import datetime, timezone

from sqlalchemy import select

from app.infrastructure.database.base import Base
from app.infrastructure.database.models import LabResultModel
from app.infrastructure.database.session import engine, get_session


def bootstrap_database() -> None:
    Base.metadata.create_all(bind=engine)

    with get_session() as session:
        has_records = session.scalar(select(LabResultModel.id).limit(1))
        if has_records:
            return

        session.add_all(
            [
                LabResultModel(
                    patient_id=1,
                    test_name="Glucose",
                    result_value="98",
                    unit="mg/dL",
                    reference_range="70-100",
                    status="Normal",
                    collected_at=datetime(2026, 6, 18, 12, 0, tzinfo=timezone.utc),
                ),
                LabResultModel(
                    patient_id=1,
                    test_name="Hemoglobin",
                    result_value="13.9",
                    unit="g/dL",
                    reference_range="12-16",
                    status="Normal",
                    collected_at=datetime(2026, 6, 18, 12, 5, tzinfo=timezone.utc),
                ),
                LabResultModel(
                    patient_id=2,
                    test_name="LDL Cholesterol",
                    result_value="162",
                    unit="mg/dL",
                    reference_range="0-130",
                    status="High",
                    collected_at=datetime(2026, 6, 17, 11, 30, tzinfo=timezone.utc),
                ),
            ]
        )
        session.commit()
