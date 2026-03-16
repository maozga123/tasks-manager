import asyncio
from supabase import acreate_client
import os
from config import get_settings

async def test():
    settings = get_settings()
    client = await acreate_client(settings.supabase_url, settings.supabase_key)
    try:
        res = await client.table("tasks").select("*").execute()
        print("SUCCESS:", res)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(test())
