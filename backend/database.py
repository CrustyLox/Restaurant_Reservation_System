from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv


load_dotenv()  # loads backend/.env if you run from backend folder

DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(DATABASE_URL)
Base = declarative_base()

session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


