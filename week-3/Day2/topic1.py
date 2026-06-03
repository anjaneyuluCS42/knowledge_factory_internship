from typing import Optional
from pydantic import BaseModel

# 1. This box for adress: (Nested Model kosam use chestam)
class StudentAddress(BaseModel):
    city: str               # Required:
    pincode: int            # Required: 

# 2. Main box: it is main student box
class StudentProfile(BaseModel):
    # --- REQUIRED FIELDS (if we didnot give these details it will show error) ---
    student_id: int
    full_name: str
    # --- NESTED FIELD (model inside another model) ---
    address: StudentAddress # we use here above address model
    # --- OPTIONAL FIELDS (no prblm while filling form about these fields will take default values) ---
    nickname: Optional[str] = None         # None will come if doesn't give
    school_name: str = "ZPHS High School"  # by default it will show school name without enter field any data

# when we entering data is their wrong in dataype missmatching it will correct
# ex: we give id as int and we give "123" they it converts it into int bcz it is string
# but when we enter "ABC" it does't convert shows error so 
#this is pydantic coercion
input_data = {
    "student_id": "123",      # we given String  but it takesn as Int
    "full_name": "Kalyan",
    "nickname": "babu",
    "address": {               # Nested Model 
        "city": "Guntur",
        "pincode": 522002
    }
    # nickname, school_name didnot give still it runs code (bcz they are Optional)
}

student = StudentProfile(**input_data)
print(f"Student ID: {student.student_id} (Type: {type(student.student_id)})") # here it converts it into int
print(f"School name: {student.school_name}") # here it comes default value
print(f"Village: {student.address.city}")       # Nested model data will comes here
print(f"Nickname: {student.nickname}")




''' Task 1: Model Foundation & Fields
Focus: Building structural blueprints and understanding how data moves into models.
Deep dive into BaseModel: Learn how to subclass BaseModel to create data structures that execute code logic instantly upon initialization.

Required vs Optional fields:
Required Fields: Declared without a default value (student_id, full_name). The code fails if these are missing.
Optional Fields: Declared with an explicit fallback assignment (= None or = "ZPHS High School"). The code automatically adds these defaults if missing.
Nested models: Implementing the StudentAddress model inside the StudentProfile model as a single variable to handle complex structures easily.
Data Coercion (Bonus): Demonstrates how the input string "1001" is automatically converted into the integer 1001 behind the scenes.'''