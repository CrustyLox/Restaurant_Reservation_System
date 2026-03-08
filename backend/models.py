from sqlalchemy import Column, Integer, String,ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class Menu(Base):
    __tablename__="menu"
    id=Column(Integer,primary_key=True)
    item_name=Column(String)
    price=Column(Integer)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    restaurant = relationship("Restaurant", back_populates="menu_items")


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location=Column(String)
    capacity=Column(Integer)
    rating=Column(Integer)
    menu_items = relationship("Menu", back_populates="restaurant")
