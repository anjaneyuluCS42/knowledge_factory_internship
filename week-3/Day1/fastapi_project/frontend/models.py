from pydantic import BaseModel # here we import pydantic(data validation library)instad of writing constructors
                                # for the product class
class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    quantity: int
    

    # def __init__(self, id: int, name: str, description: str, price: float, quantity: int):
    #     self.id = id
    #     self.name= name
    #     self.description= description
    #     self.price= price
    #     self.quantity= quantity

class Student(): # here we didnot use pydantic library
    id : int
    name:str
    age:int
    branch:str

    def __init__(self,id : int,name: str,age: int,branch: str):
        self.id =id
        self.name =name
        self.age = age
        self.branch= branch