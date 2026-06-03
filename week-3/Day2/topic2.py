from pydantic import BaseModel, Field, field_validator, model_validator
from typing_extensions import Self

class ProductOrder(BaseModel):
    # 1. Field() Validation: rules must be have value in min / max range or ge / le
    item_name: str = Field(min_length=3, max_length=50)
    quantity: int = Field(ge=1)  # ge=1 means 1or greater than 1
    
    # 2. Field() Pattern Validation: it will start with SAVE
    coupon_code: str = Field(pattern=r"^SAVE\d+$") # ex SAVE10, SAVE50
    
    item_price: float = Field(ge=10.0) # కనీస ధర 10 రూపాయలు ఉండాలి
    total_bill: float

    # 3. field_validator: for item_name field
    @field_validator('item_name')
    @classmethod
    def check_restricted_items(cls, value: str) -> str:
        # item name doesn't contain plastic
        if 'plastic' in value.lower():
            raise ValueError("please doesn't order plastic items")
        return value

    # 4. model_validator: it will check bill amount crct or wrong
    @model_validator(mode='after')
    def verify_total_bill(self) -> Self:
        expected_bill = self.quantity * self.item_price
        # incase total wrong it show error
        if self.total_bill != expected_bill:
            raise ValueError(f"bill gets error but real bill value: {expected_bill}")
        return self

# ==========================================
# (Testing Validations)
# ==========================================
try:
    #try to enter wrong bill  (5 * 10 = 50 total, but we give 100 )
    wrong_order = ProductOrder(
        item_name="Notebook", 
        quantity=5, 
        coupon_code="SAVE10", 
        item_price=10.0, 
        total_bill=100.0
    )
except ValueError as e:
    print("❌ order cancel bcz bill total will mismatch")

try:
    # try to order plastic items
    plastic_order = ProductOrder(
        item_name="Plastic Bottle", 
        quantity=1, 
        coupon_code="SAVE50", 
        item_price=20.0, 
        total_bill=20.0
    )
except ValueError as e:
    print("❌ order cancel bcz we does't sell plastic items!")


'''Advanced Logic & Custom Validations
Focus: Enforcing strict data bounds, syntax patterns, and custom business rules.
 Topics Covered in this Code:
 Validation with Field():
 min_length & max_length: Restricts the allowed characters inside strings (item_name).
 ge (Greater than or equal to): Ensures mathematical values never drop below a set floor limit (quantity, item_price).
 pattern: Uses Regular Expressions (Regex) to enforce formatting rules on text inputs (coupon_code must start with SAVE followed by numbers).
 field_validator(): Intercepts data inside a single field (item_name) to apply custom rules, like banning specific words ("plastic").
 model_validator(): Evaluates the model data after individual fields are processed. It allows cross-field comparisons (e.g., verifying if quantity * item_price == total_bill).
'''