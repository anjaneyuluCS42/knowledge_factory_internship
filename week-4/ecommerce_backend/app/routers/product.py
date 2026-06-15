
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import File

import json
import shutil
import uuid

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

from app.models.product import Product

from app.schemas.product import (
    ProductCreate,
    ProductResponse
)

from app.auth.oauth2 import (
    get_current_user
)

from app.cache.redis_client import (
    redis_client
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# CREATE PRODUCT
@router.post("/", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):

    new_product = Product(
        **product.dict(),
        owner_id=current_user.id
    )

    db.add(new_product)

    await db.commit()

    # CLEAR CACHE
    await redis_client.delete(
        "all_products"
    )

    await db.refresh(new_product)

    return new_product


# GET ALL PRODUCTS WITH REDIS CACHE
@router.get("/", response_model=list[ProductResponse])
async def get_products(
    db: AsyncSession = Depends(get_db)
):

    cache_key = "all_products"

    # CHECK CACHE
    cached_products = await redis_client.get(
        cache_key
    )

    # CACHE HIT
    if cached_products:

        print("CACHE HIT")

        return json.loads(cached_products)

    print("CACHE MISS")

    # FETCH FROM DATABASE
    result = await db.execute(
        select(Product)
    )

    products = result.scalars().all()

    product_list = []

    for product in products:

        product_list.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "stock": product.stock,
            "owner_id": product.owner_id,
            "image_url": product.image_url
        })

    # SAVE CACHE
    await redis_client.set(
        cache_key,
        json.dumps(product_list),
        ex=60
    )

    return product_list


# GET SINGLE PRODUCT
@router.get("/{product_id}",
            response_model=ProductResponse)
async def get_single_product(
    product_id: int,
    db: AsyncSession = Depends(get_db)
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

    return product


# UPDATE PRODUCT
@router.put("/{product_id}",
            response_model=ProductResponse)
async def update_product(
    product_id: int,
    updated_product: ProductCreate,
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

    # OWNER CHECK
    if product.owner_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    product.name = updated_product.name
    product.description = updated_product.description
    product.price = updated_product.price
    product.stock = updated_product.stock

    await db.commit()

    # CLEAR CACHE
    await redis_client.delete(
        "all_products"
    )

    await db.refresh(product)

    return product


# DELETE PRODUCT
@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
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

    # OWNER CHECK
    if product.owner_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    await db.delete(product)

    await db.commit()

    # CLEAR CACHE
    await redis_client.delete(
        "all_products"
    )

    return {
        "message": "Product deleted"
    }


# UPLOAD PRODUCT IMAGE
@router.post("/{product_id}/upload-image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
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

    # OWNER CHECK
    if product.owner_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    # IMAGE VALIDATION
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ]:

        raise HTTPException(
            status_code=400,
            detail="Only image files allowed"
        )

    # UNIQUE FILE NAME
    filename = f"{uuid.uuid4()}_{file.filename}"

    filepath = f"uploads/product_images/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    product.image_url = filepath

    await db.commit()

    # CLEAR CACHE
    await redis_client.delete(
        "all_products"
    )

    return {
        "message": "Image uploaded",
        "image_url": filepath
    }

