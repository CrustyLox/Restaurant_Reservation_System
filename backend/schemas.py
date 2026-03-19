from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, time, datetime


#user schemas

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


#restaurant schemas

class RestaurantCreate(BaseModel):
    name: str
    location: str
    cuisine: Optional[str] = None
    opening_time: Optional[time] = None
    closing_time: Optional[time] = None


class RestaurantResponse(BaseModel):
    restaurant_id: int
    name: str
    location: str
    cuisine: Optional[str] = None
    opening_time: Optional[time] = None
    closing_time: Optional[time] = None
    avg_rating: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


#restaurant schemas

class RestaurantTableCreate(BaseModel):
    restaurant_id: int
    table_number: int
    capacity: int


class RestaurantTableResponse(BaseModel):
    table_id: int
    restaurant_id: int
    table_number: int
    capacity: int

    class Config:
        from_attributes = True


# reservations

class ReservationCreate(BaseModel):
    user_id: int
    table_id: int
    restaurant_id: int
    reservation_date: date
    reservation_time: time
    guests: int
    status: Optional[str] = "pending"


class ReservationResponse(BaseModel):
    reservation_id: int
    user_id: int
    table_id: int
    restaurant_id: int
    reservation_date: date
    reservation_time: time
    guests: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# reviews schemas

class ReviewCreate(BaseModel):
    user_id: int
    restaurant_id: int
    rating: int
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    review_id: int
    user_id: int
    restaurant_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True