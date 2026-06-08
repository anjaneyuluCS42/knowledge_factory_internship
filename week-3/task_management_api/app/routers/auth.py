from fastapi import APIRouter
from fastapi import Depends
from app.utils.security import hash_password
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin

from app.utils.security import create_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.utils.security import verify_token

from app.utils.security import verify_password

from app.database import get_db

from app.models.user import User

from app.schemas.user import UserCreate

router = APIRouter( tags=["user login"])

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/login"
)

@router.get("/auth")
def auth_home():

    return {
        "message": "Auth Working"
    }

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        branch=user.branch
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User Registered Successfully"
    }
    

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:

        return {
            "message": "Invalid Email"
        }

    password_match = verify_password(
        form_data.password,
        db_user.password
    )

    if not password_match:

        return {
            "message": "Invalid Password"
        }

    access_token = create_access_token(
        data={
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(
    token: str = Depends(oauth2_scheme)
):

    email = verify_token(token)

    if not email:

        return {
            "message": "Invalid Token"
        }

    return {
        "logged_in_user": email
    }