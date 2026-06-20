from sqlalchemy import select

from app.infrastructure.database.base import Base
from app.infrastructure.database.models import PatientModel
from app.infrastructure.database.session import engine, get_session


def bootstrap_database() -> None:
    Base.metadata.create_all(bind=engine)

    with get_session() as session:
        has_records = session.scalar(select(PatientModel.id).limit(1))
        if has_records:
            return

        session.add_all(
            [
                PatientModel(full_name="Ana Perez", document_number="1712345678"),
                PatientModel(full_name="Luis Gomez", document_number="1723456789"),
                PatientModel(full_name="Sofia Ramirez", document_number="1734567890"),
            ]
        )
        session.commit()
