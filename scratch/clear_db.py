import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def clear_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["intellichain_ip"]
    collection = db["ips"]
    
    result = await collection.delete_many({})
    print(f"Banco de dados LIMPO! {result.deleted_count} registros removidos.")

if __name__ == "__main__":
    asyncio.run(clear_db())
