from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.infrastructure.database.bootstrap import bootstrap_database
from app.presentation.routers.health import router as health_router
from app.presentation.routers.patients import router as patients_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    bootstrap_database()
    yield


app = FastAPI(title="System A API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router)
app.include_router(patients_router)
