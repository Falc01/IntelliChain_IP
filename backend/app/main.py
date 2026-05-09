from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Permite o frontend
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos (GET, POST, etc)
    allow_headers=["*"], # Permite todos os cabeçalhos
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
        
        # 3. Comparar com registros existentes (Apenas os que completaram o registro ou foram aprovados)
        existing_ips = await db.get_all_ips()
        highest_approved_similarity = 0.0
        highest_rejected_similarity = 0.0
        similar_to = None
        
        for existing in existing_ips:
            # SÓ COMPARA se o registro tiver um tx_hash (pagamento concluído) ou for um status final
            if "embedding" in existing and (existing.get("tx_hash") or existing.get("status") == "APPROVED"):
                sim = ai_engine.calculate_similarity(new_embedding, existing["embedding"])
                
                status_existing = existing.get("status", "APPROVED")
                
                if status_existing == "REJECTED":
                    if sim > highest_rejected_similarity:
                        highest_rejected_similarity = sim
                elif status_existing == "APPROVED":
                    if sim > highest_approved_similarity:
                        highest_approved_similarity = sim
        
        # 4. Decisão baseada no novo esquema de filtros
        # FILTRO 1: Contra Rejeitados (Anti-spam/fraude)
        if highest_rejected_similarity > 0.999:
            status = "REJECTED"
            message = "Tentativa de burla detectada. Conteúdo quase idêntico a um registro já recusado."
            result_status = "REJECTED"
        
        # FILTRO 2: Contra Aprovados (Similaridade de IP)
        elif highest_approved_similarity > 0.85:
            status = "PENDING_REVIEW"
            message = "Similaridade alta detectada com um registro oficial. Aguardando revisão humana."
            result_status = "PENDING"
        
        else:
            status = "APPROVED"
            message = "IP único detectado. Liberado para registro."
            result_status = "APPROVED"
        
        # 5. RETORNO (Sem salvar no banco ainda)
        return {
            "status": result_status,
            "message": message,
            "similarity_score": round(float(max(highest_approved_similarity, highest_rejected_similarity)), 4),
            "content": ip.content,
            "embedding": new_embedding,
            "metadata": {
                "title": ip.metadata.get("title", "Sem Título") if ip.metadata else "Sem Título",
                "author": ip.metadata.get("author") if ip.metadata else None,
                "content_hash": ip.metadata.get("content_hash") if ip.metadata else None,
                "status_ia": status # Status interno que será usado no /confirm
            }
        }
        
    except Exception as e:
        print(f"Erro na verificação: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/confirm")
async def confirm_registration(data: dict):
    """Salva o registro no MongoDB apenas após o sucesso na Solana."""
    import datetime
    try:
        # Log para depuração
        print(f"Recebendo confirmação para TX: {data.get('tx_hash')}")
        
        new_record = {
            "title": data.get("title", "Sem Título"),
            "content": data.get("content"),
            "content_hash": data.get("content_hash"),
            "owner": data.get("author"),
            "status": data.get("status_ia"),
            "embedding": data.get("embedding"),
            "highest_similarity": data.get("similarity_score"),
            "verification_type": "dual_filter",
            "created_at": datetime.datetime.now().isoformat(),
            "tx_hash": data.get("tx_hash") # O campo crucial
        }
        
        inserted_id = await db.save_ip(new_record)
        print(f"Registro salvo com sucesso! ID: {inserted_id}")
        return {"id": inserted_id}
    except Exception as e:
        print(f"Erro ao confirmar registro: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/admin/pending")
async def list_pending_reviews():
    """Retorna a lista de IPs que precisam de revisão humana."""
    return await db.get_pending_reviews()

@app.post("/admin/resolve")
async def resolve_review(request_id: str, decision: str):
    """Resolve uma revisão pendente (Aprovar ou Rejeitar)."""
    if decision not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Decisão inválida. Use APPROVED ou REJECTED.")
    
    success = await db.update_ip_status(request_id, decision)
    return {
        "message": f"Registro {request_id} resolvido como {decision}",
        "success": success
    }
