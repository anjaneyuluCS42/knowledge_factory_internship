# FastAPI + Celery + Redis Email Automation Project

## Project Overview

This project demonstrates how to use:

* FastAPI
* Celery
* Redis
* Gmail SMTP

to build a real-world asynchronous email sending system.

When a user registers using FastAPI Swagger UI (`/docs`), the application:

1. Receives user data
2. Sends task to Celery
3. Stores task temporarily in Redis queue
4. Celery worker processes task
5. Real welcome email is sent automatically

---

# Technologies Used

* Python
* FastAPI
* Celery
* Redis
* Gmail SMTP
* Uvicorn

---

# Project Architecture

```text
User
  ↓
FastAPI API
  ↓
Celery Queue
  ↓
Redis Broker
  ↓
Celery Worker
  ↓
Gmail SMTP
  ↓
Welcome Email Sent
```

---

# Folder Structure

```text
day3-celery/
│
├── main.py
├── tasks.py
├── celery_worker.py
├── venv/
```

---

# Installation

## Step 1 — Create Virtual Environment

```bash
python -m venv venv
```

Activate environment:

```bash
venv\Scripts\activate
```

---

# Install Packages

```bash
pip install fastapi uvicorn celery redis==4.5.5
```

---

# Redis Setup

Download Redis for Windows:

https://github.com/tporadowski/redis/releases

Use:

```text
Redis-x64-5.0.14.1.zip
```

---

# celery_worker.py

```python
from celery import Celery

celery_app = Celery(
    "tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.task_track_started = True
```

---

# tasks.py

```python
from celery_worker import celery_app
import smtplib
from email.mime.text import MIMEText

@celery_app.task
def send_welcome_email(name, receiver_email):

    sender_email = "YOUR_GMAIL@gmail.com"

    app_password = "YOUR_APP_PASSWORD"

    subject = "Welcome Email"

    body = f"""
    Hi {name},

    Welcome to our platform 🚀

    Registration successful.
    """

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    server = smtplib.SMTP("smtp.gmail.com", 587)

    server.starttls()

    server.login(sender_email, app_password)

    server.sendmail(
        sender_email,
        receiver_email,
        msg.as_string()
    )

    server.quit()

    print("Email sent successfully!")

    return "SUCCESS"
```

---

# main.py

```python
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
```

---

# How To Run Project

## Terminal 1 — Start Redis

```bash
redis-server.exe
```

---

## Terminal 2 — Start Celery Worker

```bash
celery -A tasks worker --pool=solo --loglevel=info
```

---

## Terminal 3 — Start FastAPI

```bash
uvicorn main:app --reload
```

---

# Open Swagger Docs

```text
http://127.0.0.1:8000/docs
```

---

# Test API

Example Request:

```json
{
  "name": "Anji",
  "email": "example@gmail.com"
}
```

---

# Example Response

```json
{
  "message": "Registration successful. Email sending in background."
}
```

---

# Worker Output

```text
Task tasks.send_welcome_email received

Email sent successfully!

Task succeeded
```

---

# Gmail App Password Setup

## Important

Do NOT use normal Gmail password.

Use:

* Google App Password

Steps:

1. Enable 2-Step Verification
2. Open App Passwords
3. Generate password
4. Use generated password in `tasks.py`

---

# Features

* Asynchronous background tasks
* Redis queue management
* Real email sending
* FastAPI Swagger testing
* Celery worker processing
* Task execution tracking

---

# Real-World Use Cases

* User registration emails
* OTP systems
* Notification systems
* AI processing queues
* Report generation
* Background jobs

---

# Concepts Learned

* Celery Workers
* Redis Broker
* Background Tasks
* Async Processing
* Task Queues
* SMTP Email Sending
* FastAPI APIs
* Task States
* Celery Architecture

---

# Future Improvements

* Add task status endpoint
* Add retry logic
* Add Flower monitoring
* Add periodic tasks using Celery Beat
* Store users in database
* Deploy using Docker

---

# Developed For Learning Backend Engineering

This project demonstrates real-world backend architecture used in modern scalable applications.
