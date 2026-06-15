from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

from app.models.product import Product

from app.auth.oauth2 import (
    get_current_user
)

from app.cache.redis_client import (
    redis_client
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

@router.post("/add/{product_id}")
async def add_to_cart(
    product_id: int,
    quantity: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):

    result = await db.execute(
        select(Product).where(
            Product.id == product_id
        )
    )

    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    cart_key = f"cart:{current_user.id}"

    await redis_client.hset(
        cart_key,
        product_id,
        quantity
    )

    return {
        "message": "Added to cart"
    }

@router.get("/")
async def get_cart(
    current_user = Depends(get_current_user)
):

    cart_key = f"cart:{current_user.id}"

    cart_items = await redis_client.hgetall(
        cart_key
    )

    return {
        "cart": cart_items
    }

@router.delete("/remove/{product_id}")
async def remove_from_cart(
    product_id: int,
    current_user = Depends(get_current_user)
):

    cart_key = f"cart:{current_user.id}"

    await redis_client.hdel(
        cart_key,
        product_id
    )

    return {
        "message": "Item removed"
    }


@router.delete("/clear")
async def clear_cart(
    current_user = Depends(get_current_user)
):

    cart_key = f"cart:{current_user.id}"

    await redis_client.delete(cart_key)

    return {
        "message": "Cart cleared"
    }