from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from .database import db
from .ai_engine import ai_engine

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to database
    await db.connect()
    yield
    # Disconnect from database
    await db.disconnect()

app = FastAPI(
    title="IntelliChain IP Backend",
    description="API para validação de Propriedade Intelectual via IA e sincronização com Solana",
    version="0.1.0",
    lifespan=lifespan
)

class IPContent(BaseModel):
    content: str
    metadata: Optional[dict] = None

@app.get("/")
async def root():
    return {"message": "IntelliChain IP API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/verify")
async def verify_ip(ip: IPContent):
    try:
        # 1. Gerar embedding para o novo conteúdo
        new_embedding = await ai_engine.get_embedding(ip.content)
        
        # 2. TODO: Buscar no MongoDB IPs existentes e comparar similaridade
        # Por enquanto, vamos simular uma busca vazia
        highest_similarity = 0.0
        
        # 3. Decisão baseada no threshold (ex: 0.85)
        THRESHOLD = 0.85
        
        if highest_similarity > THRESHOLD:
            # Salvar no MongoDB como PENDING
            await db.db.ips.insert_one({
                "content": ip.content,
                "metadata": ip.metadata,
                "status": "PENDING_REVIEW",
                "embedding": new_embedding
            })
            return {
                "status": "PENDING",
                "message": "Similaridade alta detectada. Aguardando revisão humana.",
                "similarity_score": highest_similarity
            }
        
        # Se for único, aprovado
        return {
            "status": "APPROVED",
            "message": "IP único detectado. Liberado para registro.",
            "similarity_score": highest_similarity
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/pending")
async def list_pending_reviews():
    # TODO: Buscar no MongoDB registros com status PENDING_REVIEW
    return []

@app.post("/admin/resolve")
async def resolve_review(request_id: str, decision: str):
    # TODO: Atualizar status no MongoDB e disparar ação se necessário
    return {"message": f"Request {request_id} resolved as {decision}"}
