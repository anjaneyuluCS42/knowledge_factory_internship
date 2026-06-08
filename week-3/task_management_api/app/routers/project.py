from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project

from app.schemas.project import ProjectCreate

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

@router.post("/")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    new_project = Project(
        title=project.title,
        description=project.description
    )

    db.add(new_project)

    db.commit()

    db.refresh(new_project)

    return {
        "message": "Project Created"
    }


@router.get("/")
def get_projects(
    db: Session = Depends(get_db)
):

    projects = db.query(Project).all()

    return projects

@router.put("/{project_id}")
def update_project(
    project_id: int,
    updated_project: ProjectCreate,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:

        return {
            "message": "Project Not Found"
        }

    project.title = updated_project.title

    project.description = updated_project.description

    db.commit()

    return {
        "message": "Project Updated"
    }

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:

        return {
            "message": "Project Not Found"
        }

    db.delete(project)

    db.commit()

    return {
        "message": "Project Deleted"
    }