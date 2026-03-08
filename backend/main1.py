from fastapi import FastAPI,Depends,HTTPException
from database import engine,session
from schemas import RestaurantCreate,RestaurantResponse,MenuCreate
import models

from sqlalchemy.orm import Session

app = FastAPI()#this creates the api server 

models.Base.metadata.create_all(bind=engine)# Create tables in database(only structure)

default_restaurants = [
    {"name": "Anthera"},
    {"name": "Feu"},
    {"name": "Barbeque Nation"},
]

#used for feeding the data into databse 
def init_db():
    db = session()
    count = db.query(models.Restaurant).count()

    if count == 0:
        for res in default_restaurants:
            db.add(models.Restaurant(**res))
        db.commit()

    db.close()
init_db()#to run the above function(important)



def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()

@app.get('/restaurants')
def get_all(db:Session=Depends(get_db)):
    restaurants=db.query(models.Restaurant).all()
    return restaurants

@app.get('/restaurants/{id}')
def get_id(id:int,db:Session=Depends(get_db)):
    restaurants=db.query(models.Restaurant).filter(models.Restaurant.id==id).first()
    if restaurants:
        return restaurants
    else:
        raise HTTPException(status_code=404,detail="No restaurant found")

@app.post("/restaurants", response_model=RestaurantResponse)
def add_restaurant(restaurant: RestaurantCreate,db: Session = Depends(get_db)):
    # check duplicate ID
    existing = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant.id).first()

    if existing:
        raise HTTPException(status_code=400,detail="Restaurant with this ID already exists")

    new_restaurant = models.Restaurant(**restaurant.model_dump())

    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)

    return new_restaurant

@app.put("/restaurants/{id}", response_model=RestaurantResponse)
def update_restaurant(id:int,restaurant:RestaurantCreate,db:Session=Depends(get_db)):
    existing_restaurant=db.query(models.Restaurant).filter(models.Restaurant.id==id).first()
    if not existing_restaurant:
          raise HTTPException(status_code=400,detail="Restaurant with this ID not available")
    existing_restaurant.name=restaurant.name
    db.commit()
    return existing_restaurant

@app.delete("/restaurants/{id}")
def delete_restaurant(id: int, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == id ).first()

    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    db.delete(restaurant)
    db.commit()

    return {"message": "Restaurant deleted"}

@app.get('/restaurants/search')
def search(name:str,db: Session = Depends(get_db)):
    result=db.query(models.Restaurant).filter(models.Restaurant.name.ilike(f"%{name}%")).all()
    return result

@app.post("/menu")
def adddmenu(menu: MenuCreate,db: Session=Depends(get_db)):
    new_item=models.Menu(**menu.model_dump())
    db.add(new_item)
    db.commit()
    return new_item


@app.get("/restaurant/{id}/menu")
def getmenu(id:int,db:Session=Depends(get_db)):
    menu=db.query(models.Menu).filter(models.Menu.restaurant_id==id).all()
    return menu












