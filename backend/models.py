from sqlalchemy import Column, Integer, String, Text, Time, Date, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reservations = relationship("Reservation", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")


class Restaurant(Base):
    __tablename__ = "restaurants"

    restaurant_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(Text, nullable=False)
    cuisine = Column(String, nullable=True)
    opening_time = Column(Time, nullable=True)
    closing_time = Column(Time, nullable=True)
    avg_rating = Column(Numeric(2, 1), nullable=False, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tables = relationship("RestaurantTable", back_populates="restaurant", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="restaurant", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="restaurant", cascade="all, delete-orphan")


class RestaurantTable(Base):
    __tablename__ = "restaurant_tables"

    table_id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"), nullable=False)
    table_number = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)

    restaurant = relationship("Restaurant", back_populates="tables")
    reservations = relationship("Reservation", back_populates="table", cascade="all, delete-orphan")


class Reservation(Base):
    __tablename__ = "reservations"

    reservation_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    table_id = Column(Integer, ForeignKey("restaurant_tables.table_id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"), nullable=False)
    reservation_date = Column(Date, nullable=False)
    reservation_time = Column(Time, nullable=False)
    guests = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reservations")
    table = relationship("RestaurantTable", back_populates="reservations")
    restaurant = relationship("Restaurant", back_populates="reservations")


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reviews")
    restaurant = relationship("Restaurant", back_populates="reviews")