from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator
from typing_extensions import Self

# 1. FastAPI యాప్‌ను క్రియేట్ చేస్తున్నాం
app = FastAPI(
    title="School & Store Management API",
    description="FastAPI with all Pydantic Concepts integrated!"
)

# =====================================================================
# 📦 GROUP 1 & 2: BLUEPRINTS, FIELDS & VALIDATIONS (Student & Product)
# =====================================================================

# --- NESTED MODEL ---
class StudentAddress(BaseModel):
    city: str
    pincode: int

# --- MAIN MODEL WITH FIELDS & VALIDATORS ---
class StudentProfile(BaseModel):
    # Required Field & Coercion (Int)
    student_id: int 
    
    # Field Validation: కనీసం 3 అక్షరాలు ఉండాలి
    full_name: str = Field(min_length=3, max_length=50)
    
    # Field Pattern Validation: హాల్ టికెట్/కూపన్ మనకు నచ్చిన ఫార్మాట్ (2 నెంబర్లు, 2 అక్షరాలు, స్లాష్, 1 అక్షరం, 1 నెంబర్)
    # ఉదాహరణకు: 22ht/f4
    admission_code: str = Field(pattern=r"^\d\d[a-z][a-z]/[a-z]\d$")
    
    # Field Math Validation: వయస్సు 14 నుండి 18 లోపే ఉండాలి
    age: int = Field(ge=14, le=18)
    
    # Nested Model Integration
    address: StudentAddress 
    
    # Optional Fields
    nickname: Optional[str] = None
    school_name: str = "ZPHS High School" # Default value

    # FIELD VALIDATOR: ఒకే ఒక్క ఫీల్డ్ మీద కస్టమ్ రూల్
    @field_validator('full_name')
    @classmethod
    def check_restricted_names(cls, value: str) -> str:
        if 'admin' in value.lower():
            raise ValueError("పేరులో 'admin' అనే పదాన్ని వాడకూడదు!")
        return value


class ProductOrder(BaseModel):
    item_name: str = Field(min_length=3)
    quantity: int = Field(ge=1)
    item_price: float = Field(ge=10.0)
    total_bill: float

    # MODEL VALIDATOR: రెండు వేర్వేరు ఫీల్డ్స్ (quantity * price) ని పోల్చి చూసే మాస్టర్ రూల్
    @model_validator(mode='after')
    def verify_total_bill(self) -> Self:
        expected_bill = self.quantity * self.item_price
        if self.total_bill != expected_bill:
            raise ValueError(f"బిల్ లెక్క తప్పింది! నిజానికి అవ్వాల్సింది: {expected_bill}")
        return self


# =====================================================================
# 🔐 GROUP 3: REQUEST / RESPONSE SCHEMA SEPARATION
# =====================================================================

# REQUEST SCHEMA: యూజర్ కొత్త అకౌంట్ క్రియేట్ చేసేటప్పుడు (పాస్‌వర్డ్ ఖచ్చితంగా ఇవ్వాలి)
class CreateUserRequest(BaseModel):
    username: str = Field(min_length=4)
    email: EmailStr
    password: str = Field(min_length=8)

    # JSON_SCHEMA_EXTRA: డెవలపర్స్ కోసం సాంపిల్ ఎగ్జాంపుల్ డాక్యుమెంటేషన్
    model_config = {
        "json_schema_extra": {
            "examples": [{
                "username": "kalyan_99",
                "email": "kalyan@gmail.com",
                "password": "secret_password_123"
            }]
        }
    }

# REQUEST SCHEMA: యూజర్ తన వివరాలు మార్చుకునేటప్పుడు (అన్నీ Optional)
class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

# RESPONSE SCHEMA: స్క్రీన్ మీద చూపించే డేటా (సెక్యూరిటీ కోసం పాస్‌వర్డ్ ఫీల్డ్ దాచేశాం!)
class UserResponse(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    created_at: datetime


# =====================================================================
# 🚀 FASTAPI ROUTES (API ENDPOINTS)
# =====================================================================

# 1. Student Route: ఇక్కడ డేటా ఆటోమేటిక్‌గా వాలిడేట్ మరియు కోయర్షన్ అవుతుంది
@app.post("/students/register")
def register_student(student: StudentProfile):
    # డేటా అంతా కరెక్ట్ గా ఉంటేనే ఈ లోపల ఉన్న కోడ్ రన్ అవుతుంది, లేకపోతే FastAPI నే ఎర్రర్ పంపేస్తుంది
    return {
        "status": "Success", 
        "message": f"Student {student.full_name} registered successfully!",
        "school": student.school_name
    }

# 2. Product Route: ఇక్కడ మోడల్ వాలిడేటర్ బిల్ లెక్కను సరిచూస్తుంది
@app.post("/orders/create")
def create_order(order: ProductOrder):
    return {
        "status": "Order Placed",
        "item": order.item_name,
        "final_amount": order.total_bill
    }

# 3. User Lifecycle Route: ఇక్కడ రిక్వెస్ట్ మరియు రెస్పాన్స్ సెపరేషన్ జరుగుతుంది
# response_model=UserResponse అని పెట్టడం వల్ల, అవుట్‌పుట్‌లో పాస్‌వర్డ్ బయటకు వెళ్లకుండా ఫిల్టర్ అవుతుంది!
@app.post("/users/signup", response_model=UserResponse)
def signup_user(user_data: CreateUserRequest):
    # రియల్ లైఫ్‌లో ఇక్కడ డేటాను డేటాబేస్‌లో సేవ్ చేస్తాం. 
    # ఇప్పుడు ఒక డెమ్మి యూజర్ ఐడీ మరియు కరెంట్ టైమ్‌తో రెస్పాన్స్ పంపుతున్నాం.
    fake_db_user = {
        "user_id": 501,
        "username": user_data.username,
        "email": user_data.email,
        "created_at": datetime.now()
        # మనం 'password' ని కూడా పంపినా, UserResponse మోడల్ దాన్ని ఆటోమేటిక్‌గా డిలీట్ చేసి దాచేస్తుంది!
    }
    return fake_db_user
