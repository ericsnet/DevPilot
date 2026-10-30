import redis
from app.core.config import settings

client = redis.Redis.from_url(settings.redis_url, socket_connect_timeout=2, socket_timeout=2, decode_responses=True)

def check_redis() -> bool:
    return bool(client.ping())
