from sqlalchemy.orm import Session

from app.application.use_cases.get_patient_lab_results import GetPatientLabResultsUseCase
from app.application.use_cases.list_patients import ListPatientsUseCase
from app.infrastructure.clients.system_b_client import SystemBLabResultGateway
from app.infrastructure.database.patient_repository_sqlalchemy import SqlAlchemyPatientRepository
from app.infrastructure.database.session import get_session


def get_db_session():
    session = get_session()
    try:
        yield session
    finally:
        session.close()


def get_list_patients_use_case(session: Session) -> ListPatientsUseCase:
    repository = SqlAlchemyPatientRepository(session)
    return ListPatientsUseCase(repository)


def get_lab_results_use_case(session: Session) -> GetPatientLabResultsUseCase:
    repository = SqlAlchemyPatientRepository(session)
    gateway = SystemBLabResultGateway()
    return GetPatientLabResultsUseCase(repository, gateway)
