from fastapi import FastAPI
from redis_client import redis_client
import time
import json

app = FastAPI()

# SAMPLE PRODUCT DATA
products_data = [
    {
        "id": 1,
        "name": "iPhone",
        "price": 70000
    },
    {
        "id": 2,
        "name": "Samsung",
        "price": 50000
    },
    {
        "id": 3,
        "name":"Vivo T2 pro",
        "price": 24000
    }
]

# GET PRODUCTS API
@app.get("/products")
async def get_products():

    start = time.time()

    # CHECK CACHE
    cached_products = await redis_client.get(
        "products"
    )

    # CACHE HIT
    if cached_products:

        end = time.time()

        return {
            "source": "redis cache",
            "response_time": end - start,
            "data": json.loads(cached_products)
        }

    # CACHE MISS
    # SAVE DATA TO CACHE
    await redis_client.set(
        "products",
        json.dumps(products_data),
        ex=60
    )

    end = time.time()

    return {
        "source": "database",
        "response_time": end - start,
        "data": products_data
    }

# CACHE DASHBOARD
@app.get("/cache-stats")
async def cache_stats():

    info = await redis_client.info()

    return {
        "cache_hits": info.get("keyspace_hits"),
        "cache_misses": info.get("keyspace_misses"),
        "used_memory": info["used_memory_human"]
    }