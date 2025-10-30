from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .models import Vendor  # noqa

from .api import router as vendors_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Запускается при старте приложения
    Base.metadata.create_all(bind=engine)
    yield
    # Тут можно добавить shutdown-логику (ничего не нужно для SQLite)


app = FastAPI(
    title="Vendor Manager API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}


app.include_router(vendors_router)