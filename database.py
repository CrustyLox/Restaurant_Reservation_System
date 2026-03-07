from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql://postgres:Jad3sBlu324@localhost:5432/Restaurantdb"

engine = create_engine(DATABASE_URL)
Base = declarative_base()

session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


