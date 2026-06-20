from fastapi import APIRouter, Depends, HTTPException

from app.domain.services.authenticated_user import AuthenticatedUser
from app.domain.services.transit_errors import TransitCipherError
from app.presentation.auth import require_any_role
from app.presentation.dependencies import (
    get_db_session,
    get_encrypted_lab_results_use_case,
    get_lab_results_use_case,
)
from app.presentation.schemas.encrypted_payload import (
    EncryptedPayloadRequest,
    EncryptedPayloadResponse,
)
from app.presentation.schemas.lab_result import LabResultResponse

router = APIRouter(prefix="/api/v1/lab-results", tags=["lab-results"])


@router.get("/{patient_id}", response_model=list[LabResultResponse])
def get_lab_results(
    patient_id: int,
    session=Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("doctor", "admin", "laboratory", "auditor")),
):
    use_case = get_lab_results_use_case(session)
    results = use_case.execute(patient_id)
    return [
        LabResultResponse(
            id=result.id,
            patient_id=result.patient_id,
            test_name=result.test_name,
            result_value=result.result_value,
            unit=result.unit,
            reference_range=result.reference_range,
            status=result.status,
            collected_at=result.collected_at,
        )
        for result in results
    ]


@router.post("/query", response_model=EncryptedPayloadResponse)
async def query_lab_results(
    request: EncryptedPayloadRequest,
    session=Depends(get_db_session),
):
    use_case = get_encrypted_lab_results_use_case(session)
    try:
        ciphertext = await use_case.execute(request.ciphertext)
    except TransitCipherError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return EncryptedPayloadResponse(ciphertext=ciphertext)
