from fastapi import FastAPI
from pydantic import BaseModel

from tasks import send_welcome_email

app = FastAPI()

class User(BaseModel):

    name: str
    email: str


@app.post("/register")
def register(user: User):

    send_welcome_email.delay(
        user.name,
        user.email
    )

    return {
        "message": "Registration successful. Email sending in background."
    }