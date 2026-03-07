from pydantic import BaseModel

class RestaurantCreate(BaseModel):
    id :int
    name: str
class RestaurantResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
