from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.schemas.student_schema import StudentCreate

router = APIRouter()

# CREATE STUDENT

@router.post("/students")
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):

    new_student = Student(
        name=student.name,
        branch=student.branch,
        marks=student.marks
    )

    db.add(new_student)

    db.commit()

    db.refresh(new_student)

    return new_student


# GET ALL STUDENTS

@router.get("/students")
def get_students(
    db: Session = Depends(get_db)
):

    students = db.query(Student).all()

    return students