import httpx

from app.core.config import settings


async def execute_python(code: str) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(f"{settings.runner_url}/execute", json={"code": code})
    response.raise_for_status()
    return response.json()

