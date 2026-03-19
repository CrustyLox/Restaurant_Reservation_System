from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv


load_dotenv()  # loads backend/.env if you run from backend folder

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL: 
    raise ValueError("DATABASE_URL is not set in .env file")


engine = create_engine(DATABASE_URL)
Base = declarative_base()

session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


