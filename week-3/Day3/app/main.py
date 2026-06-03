from fastapi import FastAPI

from app.database import engine
from app.database import Base

from app.routers.student_router import router

app = FastAPI()

# CREATE TABLES

Base.metadata.create_all(bind=engine)

# INCLUDE ROUTERS

app.include_router(router)

@app.get("/")
def home():

    return {
        "message": "FastAPI PostgreSQL Project Running"
    }