from app.domain.repositories.lab_result_repository import LabResultRepository
from app.domain.services.transit_cipher import TransitCipher


class QueryEncryptedLabResultsUseCase:
    def __init__(
        self,
        lab_result_repository: LabResultRepository,
        transit_cipher: TransitCipher,
    ):
        self._lab_result_repository = lab_result_repository
        self._transit_cipher = transit_cipher

    async def execute(self, ciphertext: str) -> str:
        decrypted_payload = await self._transit_cipher.decrypt_json(ciphertext)
        patient_id = int(decrypted_payload["patient_id"])
        results = self._lab_result_repository.list_by_patient(patient_id)
        serializable_results = [
            {
                "id": result.id,
                "patient_id": result.patient_id,
                "test_name": result.test_name,
                "result_value": result.result_value,
                "unit": result.unit,
                "reference_range": result.reference_range,
                "status": result.status,
                "collected_at": result.collected_at.isoformat(),
            }
            for result in results
        ]
        return await self._transit_cipher.encrypt_json({"lab_results": serializable_results})
