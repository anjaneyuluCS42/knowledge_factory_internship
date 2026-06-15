from fastapi import FastAPI
from fastapi import Depends

from fastapi.staticfiles import StaticFiles

from app.routers.product import (
    router as product_router )

from app.models.user import User
from app.models.product import Product

from app.database import engine
from app.database import Base

from app.routers.cart import (
    router as cart_router
)

from app.routers.websocket import (
    router as websocket_router
)

from app.routers.auth import router as auth_router

from app.models.order import (
    Order,
    OrderItem
)

from app.routers.order import (
    router as order_router
)

from app.auth.oauth2 import get_current_user

app = FastAPI()
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(websocket_router)


@app.on_event("startup")
async def startup():

    async with engine.begin() as conn:
        await conn.run_sync(
            Base.metadata.create_all
        )


app.include_router(auth_router)


@app.get("/", tags = ["Home"])
async def root():
    return {
        "message": "E-Commerce Backend Running"
    }


@app.get("/profile", tags = ["users"])
async def profile(
    current_user = Depends(get_current_user)
):

    return {
        "message": "Protected Route",
        "user": current_user.email
    }

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)