from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_admin: bool = False

class UserOut(BaseModel):
    email: EmailStr
    is_admin: bool

    class Config:
        orm_mode = True
