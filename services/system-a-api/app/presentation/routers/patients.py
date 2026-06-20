from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.domain.services.authenticated_user import AuthenticatedUser
from app.domain.services.errors import PatientNotFoundError, UpstreamServiceError
from app.presentation.auth import require_any_role, require_authenticated_user
from app.presentation.dependencies import (
    get_db_session,
    get_lab_results_use_case,
    get_list_patients_use_case,
)
from app.presentation.schemas.lab_result import LabResultResponse
from app.presentation.schemas.patient import PatientResponse

router = APIRouter(prefix="/api/v1/patients", tags=["patients"])


@router.get("", response_model=list[PatientResponse])
def list_patients(
    session: Session = Depends(get_db_session),
    _: AuthenticatedUser = Depends(require_any_role("doctor", "admin", "auditor")),
):
    use_case = get_list_patients_use_case(session)
    patients = use_case.execute()
    return [
        PatientResponse(
            id=patient.id,
            full_name=patient.full_name,
            document_number=patient.document_number,
        )
        for patient in patients
    ]


@router.get("/{patient_id}/lab-results", response_model=list[LabResultResponse])
async def get_lab_results(
    patient_id: int,
    session: Session = Depends(get_db_session),
    authenticated_user: AuthenticatedUser = Depends(
        require_any_role("doctor", "admin", "laboratory", "auditor")
    ),
):
    use_case = get_lab_results_use_case(session)
    try:
        results = await use_case.execute(patient_id, authenticated_user.access_token)
    except PatientNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except UpstreamServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

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
