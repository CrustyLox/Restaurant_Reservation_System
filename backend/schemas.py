from pydantic import BaseModel

class RestaurantCreate(BaseModel):
    id :int
    name: str
    location:str
    capacity:int
    rating:int
class RestaurantResponse(BaseModel):
    id: int
    name: str
    location:str
    capacity:int
    rating:int
class MenuCreate(BaseModel):
     item_name: str
     price: int
     restaurant_id: int
class MenuResponse(BaseModel):
    id: int
    item_name: str
    price: int
    restaurant_id: int


class Config:
        rom_attributes = True
