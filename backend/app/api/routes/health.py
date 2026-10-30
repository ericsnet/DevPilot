from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from redis.exceptions import RedisError
from app.core.database import check_database
from app.core.redis_client import check_redis

router = APIRouter(tags=["health"])

@router.get("/health/live")
def liveness() -> dict[str, str]:
    return {"status": "ok"}

@router.get("/health/ready")
def readiness() -> dict[str, str]:
    try:
        check_database()
        check_redis()
    except (SQLAlchemyError, RedisError, OSError) as exc:
        raise HTTPException(status_code=503, detail="One or more dependencies are unavailable") from exc
    return {"status": "ready", "database": "ok", "redis": "ok"}
