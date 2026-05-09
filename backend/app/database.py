from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "intellichain_ip"

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        cls.client = AsyncIOMotorClient(MONGO_URL)
        cls.db = cls.client[DB_NAME]
        print(f"Connected to MongoDB at {MONGO_URL}")

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB")

    @classmethod
    async def save_ip(cls, ip_data: dict):
        """Salva um novo registro de IP no banco."""
        result = await cls.db.ips.insert_one(ip_data)
        return str(result.inserted_id)

    @classmethod
    async def get_all_ips(cls) -> List[dict]:
        """Retorna todos os IPs registrados para comparação de similaridade."""
        cursor = cls.db.ips.find({})
        return await cursor.to_list(length=1000)

    @classmethod
    async def get_pending_reviews(cls) -> List[dict]:
        """Retorna IPs que aguardam revisão humana."""
        cursor = cls.db.ips.find({"status": "PENDING_REVIEW"})
        ips = await cursor.to_list(length=100)
        # Converter ObjectId para string para facilitar o JSON
        for ip in ips:
            ip["_id"] = str(ip["_id"])
        return ips

    @classmethod
    async def update_ip_status(cls, ip_id: str, status: str):
        """Atualiza o status de um registro de IP."""
        await cls.db.ips.update_one(
            {"_id": ObjectId(ip_id)},
            {"$set": {"status": status}}
        )
        return True

db = Database
