import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def dump_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["intellichain_ip"]
    collection = db["ips"]
    
    print("--- DUMP DE REGISTROS NO MONGODB ---")
    cursor = collection.find({})
    count = 0
    async for doc in cursor:
        count += 1
        print(f"ID: {doc['_id']}")
        print(f"Título: {doc.get('title')}")
        print(f"Status: {doc.get('status')}")
        print(f"Similaridade Max: {doc.get('highest_similarity')}")
        print(f"Conteúdo: {doc.get('content')[:100]}...")
        print("-" * 30)
    
    if count == 0:
        print("O banco está VAZIO.")
    else:
        print(f"Total de registros encontrados: {count}")

if __name__ == "__main__":
    asyncio.run(dump_db())
