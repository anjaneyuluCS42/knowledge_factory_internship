from pydantic import BaseModel

class TaskCreate(BaseModel):

    title: str

    description: str

    assigned_to: int

    project_id: int