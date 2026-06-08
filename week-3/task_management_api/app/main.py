from fastapi import FastAPI

from app.database import engine, Base

from app.models.user import User
from app.models.project import Project

from app.routers import auth
from app.routers import project

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)

app.include_router(project.router)

@app.get("/")
def home():

    return {
        "message": "Task API Running"
    }