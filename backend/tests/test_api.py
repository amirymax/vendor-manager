# backend/tests/test_api.py
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db import Base, get_db
from app import models

# --- Тестовая БД: SQLite in-memory, один пул соединений ---
engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # важно для работы in-memory в нескольких сессиях
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Создаём таблицы для тестов
Base.metadata.create_all(bind=engine)

# Переопределяем зависимость get_db на тестовую сессию
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_create_vendor_ok():
    payload = {
        "name": "Acme Inc",
        "contact_email": "contact@acme.com",
        "category": "Hardware",
        "rating": 4,
    }
    r = client.post("/api/vendors", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["id"] > 0
    assert data["name"] == payload["name"]
    assert data["contact_email"] == payload["contact_email"]
    assert data["category"] == payload["category"]
    assert data["rating"] == payload["rating"]

def test_list_vendors_contains_created():
    r = client.get("/api/vendors")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert any(v["name"] == "Acme Inc" for v in items)

def test_update_vendor_ok():
    # создаём нового
    r = client.post("/api/vendors", json={
        "name": "Foo",
        "contact_email": "foo@example.com",
        "category": "Books",
        "rating": 2,
    })
    vid = r.json()["id"]

    # обновляем рейтинг
    r2 = client.put(f"/api/vendors/{vid}", json={"rating": 5})
    assert r2.status_code == 200, r2.text
    assert r2.json()["rating"] == 5

def test_validation_errors():
    # неверный email
    bad = {
        "name": "Bad",
        "contact_email": "not-an-email",
        "category": "X",
        "rating": 1,
    }
    r = client.post("/api/vendors", json=bad)
    assert r.status_code in (400, 422)

    # рейтинг вне диапазона
    bad2 = {
        "name": "Bad2",
        "contact_email": "a@b.com",
        "category": "Ok",
        "rating": 6,
    }
    r2 = client.post("/api/vendors", json=bad2)
    assert r2.status_code in (400, 422)
