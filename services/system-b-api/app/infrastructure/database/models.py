from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.database.base import Base


class LabResultModel(Base):
    __tablename__ = "lab_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    patient_id: Mapped[int] = mapped_column(Integer, nullable=False)
    test_name: Mapped[str] = mapped_column(String(120), nullable=False)
    result_value: Mapped[str] = mapped_column(String(30), nullable=False)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    reference_range: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    collected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
