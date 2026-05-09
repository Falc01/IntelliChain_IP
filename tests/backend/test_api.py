import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.database import db
from backend.app.ai_engine import ai_engine
import numpy as np

# Mock do AI Engine
async def mock_get_embedding(text: str):
    # Retorna um vetor simples para teste
    if "único" in text.lower():
        return [1.0, 0.0, 0.0]
    return [0.0, 1.0, 0.0]

def mock_calculate_similarity(emb1, emb2):
    # Se os vetores forem iguais, 1.0
    if emb1 == emb2:
        return 1.0
    return 0.1

# Mock do Banco de Dados
mock_db_ips = [
    {"_id": "123", "content": "Texto já registrado e conhecido", "embedding": [0.0, 1.0, 0.0], "status": "APPROVED"}
]

async def mock_get_all_ips():
    return mock_db_ips

async def mock_save_ip(ip_data):
    return "mocked_id_456"

async def mock_get_pending_reviews():
    return [{"_id": "mock_id", "status": "PENDING_REVIEW"}]

async def mock_update_ip_status(ip_id, status):
    return True

@pytest.fixture
def patch_dependencies(monkeypatch):
    monkeypatch.setattr(ai_engine, "get_embedding", mock_get_embedding)
    monkeypatch.setattr(ai_engine, "calculate_similarity", mock_calculate_similarity)
    monkeypatch.setattr(db, "get_all_ips", mock_get_all_ips)
    monkeypatch.setattr(db, "save_ip", mock_save_ip)
    monkeypatch.setattr(db, "get_pending_reviews", mock_get_pending_reviews)
    monkeypatch.setattr(db, "update_ip_status", mock_update_ip_status)

@pytest.mark.asyncio
async def test_read_main():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "IntelliChain IP API is running"}

@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_verify_ip_unique(patch_dependencies):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Texto com "único" vai retornar vetor [1,0,0], que tem 0.1 de similaridade com [0,1,0]
        payload = {"content": "Este é um texto único", "metadata": {}}
        response = await ac.post("/verify", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "APPROVED"
    assert data["id"] == "mocked_id_456"

@pytest.mark.asyncio
async def test_verify_ip_similar(patch_dependencies):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Texto sem "único" retorna [0,1,0], gerando 1.0 de similaridade
        payload = {"content": "Texto já registrado e conhecido", "metadata": {}}
        response = await ac.post("/verify", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PENDING"
    assert data["similarity_score"] == 1.0

@pytest.mark.asyncio
async def test_admin_pending(patch_dependencies):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/admin/pending")
    
    assert response.status_code == 200
    assert len(response.json()) == 1

@pytest.mark.asyncio
async def test_admin_resolve_valid(patch_dependencies):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/admin/resolve?request_id=mock_id&decision=APPROVED")
    
    assert response.status_code == 200
    assert response.json()["success"] is True

@pytest.mark.asyncio
async def test_admin_resolve_invalid(patch_dependencies):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/admin/resolve?request_id=mock_id&decision=INVALID")
    
    assert response.status_code == 400
