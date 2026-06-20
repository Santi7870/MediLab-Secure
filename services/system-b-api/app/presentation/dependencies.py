from app.application.use_cases.get_lab_results import GetLabResultsUseCase
from app.application.use_cases.query_encrypted_lab_results import QueryEncryptedLabResultsUseCase
from app.infrastructure.security.vault_transit_cipher import VaultTransitCipher
from app.infrastructure.database.session import get_session
from app.infrastructure.repositories.lab_result_repository_sqlalchemy import (
    SqlAlchemyLabResultRepository,
)


def get_db_session():
    session = get_session()
    try:
        yield session
    finally:
        session.close()


def get_lab_results_use_case(session):
    repository = SqlAlchemyLabResultRepository(session)
    return GetLabResultsUseCase(repository)


def get_encrypted_lab_results_use_case(session):
    repository = SqlAlchemyLabResultRepository(session)
    transit_cipher = VaultTransitCipher()
    return QueryEncryptedLabResultsUseCase(repository, transit_cipher)
