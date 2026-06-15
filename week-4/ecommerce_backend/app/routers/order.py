from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db

from app.tasks.order_tasks import (
    send_order_confirmation_email
)

from app.websocket.manager import (
    manager
)

from app.models.order import (
    Order,
    OrderItem
)

from app.models.product import Product

from app.auth.oauth2 import (
    get_current_user
)

from app.cache.redis_client import (
    redis_client
)

from app.schemas.order import (
    OrderResponse
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("/place",
             response_model=OrderResponse)
async def place_order(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):

    cart_key = f"cart:{current_user.id}"

    cart_items = await redis_client.hgetall(
        cart_key
    )

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total_price = 0

    order = Order(
        user_id=current_user.id,
        total_price=0
    )

    db.add(order)

    await db.commit()

    await db.refresh(order)

    for product_id, quantity in cart_items.items():

        result = await db.execute(
            select(Product).where(
                Product.id == int(product_id)
            )
        )

        product = result.scalar_one_or_none()

        if not product:
            continue

        quantity = int(quantity)

        # STOCK VALIDATION
        if product.stock < quantity:

            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name}"
            )

        # REDUCE STOCK
        product.stock -= quantity

        item_total = product.price * quantity

        total_price += item_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )

        db.add(order_item)

    order.total_price = total_price

    await db.commit()

    # CLEAR CART
    await redis_client.delete(cart_key)
    send_order_confirmation_email.delay(
    current_user.email,
    order.id)

    await manager.broadcast(
    f"New Order Placed: Order #{order.id}"
)

    return order


@router.get("/history",
            response_model=list[OrderResponse])
async def order_history(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):

    result = await db.execute(
        select(Order).where(
            Order.user_id == current_user.id
        )
    )

    orders = result.scalars().all()

    return orders