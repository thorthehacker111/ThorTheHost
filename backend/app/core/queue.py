import redis
import json
from app.core.config import settings

# Initialize Redis connection pool
redis_client = redis.from_url(settings.redis_url, decode_responses=True)

QUEUE_NAME = "thorthehost:mail_queue"

def enqueue_email(payload: dict):
    """
    Push an email payload to the Redis queue for the worker to process.
    """
    redis_client.rpush(QUEUE_NAME, json.dumps(payload))

def dequeue_email(timeout: int = 5):
    """
    Block and wait for an email payload from the Redis queue.
    """
    result = redis_client.blpop(QUEUE_NAME, timeout=timeout)
    if result:
        _, data = result
        return json.loads(data)
    return None
