
from fastapi import FastAPI
from models import Product
from models import Student

app = FastAPI()


@app.get("/")
def greet():
    return  "Hello World"

products = [
    Product(id =1, name ="phone",description ="budget mobile",price =99,quantity =10),
    Product(id = 2,name = "laptop",description ="gaming laptop",price =999,quantity =5)
]


@app.get("/products")
def get_all_products():
    return products


# if we want particular product in url search like product/1,product/2
# @app.get("/products/{id}")  # user enter products/1 or /2
# def get_product_by_id(id: int):
#     return products[id-1]  # here we calling index
@app.get("/product/{id}")
def get_product_by_id(id: int):
    for product in products:
        if product.id == id:
            return product
    return "product not found"

#post
@app.post("/product")
def add_producr(product: Product):
    products.append(product)
    return product

#put/update
@app.put("/product")
def update_products(id: int, product: Product):
    for i in range(len(products)):
        if products[i].id == id:
            products[i] = product
            return "product added successfully"


#example 2

students=[
    Student(1,"anji",22,"CSE"),
    Student(2,"krishna",23,"ECE"),
    Student(3,"Hari",24,"Civil")
]

@app.get("/student")
def get_stu_detail():
    return students
 
@app.get("/student/{id}")
def get_student_detail(id:int):
    for student in students:
        if student.id == id:
            return student


    return "product not found"

# @app.post("/student")
# def add_stdent_details(student: Student):
#     students.append(student)
#     return student







