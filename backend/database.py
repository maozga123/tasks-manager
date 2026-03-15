from __future__ import annotations

import logging
from functools import lru_cache

from supabase import AsyncClient, acreate_client

from config import get_settings

logger = logging.getLogger(__name__)

# Module-level singleton — populated during app lifespan startup
_supabase: AsyncClient | None = None


async def init_supabase() -> None:
    """Create the async Supabase client and store it as a module singleton."""
    global _supabase
    settings = get_settings()
    logger.info("Connecting to Supabase at %s", settings.supabase_url)
    _supabase = await acreate_client(settings.supabase_url, settings.supabase_key)
    logger.info("Supabase async client initialised ✓")


async def close_supabase() -> None:
    """Clean up the Supabase client on app shutdown."""
    global _supabase
    if _supabase is not None:
        # supabase-py v2 uses httpx internally — close the transport
        try:
            await _supabase.auth.sign_out()
        except Exception:
            pass
        _supabase = None
        logger.info("Supabase client closed ✓")


def get_db() -> AsyncClient:
    """
    FastAPI dependency — returns the active Supabase client.
    Raises RuntimeError if called before lifespan startup.
    """
    if _supabase is None:
        raise RuntimeError(
            "Supabase client is not initialised. "
            "Ensure the app lifespan has run startup."
        )
    return _supabase
