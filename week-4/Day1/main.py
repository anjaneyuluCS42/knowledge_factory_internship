from fastapi import FastAPI
import httpx
import asyncio
import time

app = FastAPI()

# -----------------------------------
# Async function to fetch API data
# -----------------------------------

async def fetch_data(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

# -----------------------------------
# Sequential API Calls
# -----------------------------------

@app.get("/sequential")
async def sequential_calls():

    start = time.time()

    data1 = await fetch_data("https://jsonplaceholder.typicode.com/posts/1")
    data2 = await fetch_data("https://jsonplaceholder.typicode.com/users/1")
    data3 = await fetch_data("https://jsonplaceholder.typicode.com/todos/1")

    end = time.time()

    return {
        "message": "Sequential Execution",
        "time_taken": end - start,
        "data": [data1, data2, data3]
    }

# -----------------------------------
# Parallel API Calls
# -----------------------------------

@app.get("/parallel")
async def parallel_calls():

    start = time.time()

    results = await asyncio.gather(
        fetch_data("https://jsonplaceholder.typicode.com/posts/1"),
        fetch_data("https://jsonplaceholder.typicode.com/users/1"),
        fetch_data("https://jsonplaceholder.typicode.com/todos/1")
    )

    end = time.time()

    return {
        "message": "Parallel Execution",
        "time_taken": end - start,
        "data": results
    }

@app.get("/wait")
async def wait_example():

    await asyncio.sleep(5)

    return {"message": "Done after 5 sec"}

@app.get("/delay")
async def delay_example():
    start = time.time()
    await asyncio.sleep(3)

    
    return {"message": "Delay displayed after 3 sec"}


    end = time.time()
    return {
        "message": "Parallel Execution",
        "time_taken": end - start,
        "data": results
    }

    