from abc import ABC, abstractmethod

from app.domain.entities.lab_result import LabResult


class LabResultGateway(ABC):
    @abstractmethod
    async def get_lab_results(self, patient_id: int, access_token: str | None = None) -> list[LabResult]:
        raise NotImplementedError
