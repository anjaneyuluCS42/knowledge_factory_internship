from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.database import Base

class Student(Base):

    __tablename__ = "students"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str]

    branch: Mapped[str]

    marks: Mapped[int]