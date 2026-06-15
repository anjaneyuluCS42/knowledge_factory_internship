from pydantic import BaseModel


class ProductCreate(BaseModel):

    name: str
    description: str
    price: float
    stock: int


class ProductResponse(ProductCreate):

    id: int
    owner_id: int
    image_url: str | None = None

    class Config:
        from_attributes = True