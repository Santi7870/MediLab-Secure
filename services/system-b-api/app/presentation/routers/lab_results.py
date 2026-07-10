from fastapi import APIRouter, Depends, HTTPException, status

from app.domain.entities.lab_result import LabResultDraft
from app.domain.services.authenticated_user import AuthenticatedUser
from app.domain.services.lab_result_errors import LabResultNotFoundError
from app.domain.services.transit_errors import TransitCipherError
from app.presentation.auth import require_any_role
from app.presentation.dependencies import (
    get_create_lab_result_use_case,
    get_db_session,
    get_delete_lab_result_use_case,
    get_encrypted_lab_results_use_case,
    get_lab_results_use_case,
    get_update_lab_result_use_case,
)
from app.presentation.schemas.encrypted_payload import (
    EncryptedPayloadRequest,
    EncryptedPayloadResponse,
)
from app.presentation.schemas.lab_result import LabResultMutationRequest, LabResultResponse

router = APIRouter(prefix="/api/v1/lab-results", tags=["lab-results"])


def _map_lab_result_response(result):
    return LabResultResponse(
        id=result.id,
        patient_id=result.patient_id,
        test_name=result.test_name,
        result_value=result.result_value,
        unit=result.unit,
        reference_range=result.reference_range,
        status=result.status,
        collected_at=result.collected_at,
    )


def _build_draft(payload: LabResultMutationRequest) -> LabResultDraft:
    return LabResultDraft(
        patient_id=payload.patient_id,
        test_name=payload.test_name.strip(),
        result_value=payload.result_value.strip(),
        unit=payload.unit.strip(),
        reference_range=payload.reference_range.strip(),
        status=payload.status.strip(),
        collected_at=payload.collected_at,
    )


@router.get("/{patient_id}", response_model=list[LabResultResponse])
def get_lab_results(
    patient_id: int,
    session=Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("doctor", "admin", "laboratory", "auditor")),
):
    use_case = get_lab_results_use_case(session)
    results = use_case.execute(patient_id)
    return [_map_lab_result_response(result) for result in results]


@router.post("", response_model=LabResultResponse, status_code=status.HTTP_201_CREATED)
def create_lab_result(
    payload: LabResultMutationRequest,
    session=Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("admin", "laboratory")),
):
    use_case = get_create_lab_result_use_case(session)
    result = use_case.execute(_build_draft(payload))
    return _map_lab_result_response(result)


@router.put("/{lab_result_id}", response_model=LabResultResponse)
def update_lab_result(
    lab_result_id: int,
    payload: LabResultMutationRequest,
    session=Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("admin", "laboratory")),
):
    use_case = get_update_lab_result_use_case(session)
    try:
        result = use_case.execute(lab_result_id, _build_draft(payload))
    except LabResultNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return _map_lab_result_response(result)


@router.delete("/{lab_result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab_result(
    lab_result_id: int,
    session=Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("admin", "laboratory")),
):
    use_case = get_delete_lab_result_use_case(session)
    try:
        use_case.execute(lab_result_id)
    except LabResultNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/query", response_model=EncryptedPayloadResponse)
async def query_lab_results(
    request: EncryptedPayloadRequest,
    session=Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("doctor", "admin", "laboratory", "auditor")),
):
    use_case = get_encrypted_lab_results_use_case(session)
    try:
        ciphertext = await use_case.execute(request.ciphertext)
    except TransitCipherError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return EncryptedPayloadResponse(ciphertext=ciphertext)
