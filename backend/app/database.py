from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

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

db = Database
