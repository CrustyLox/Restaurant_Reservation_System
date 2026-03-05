CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255)
);

CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    location TEXT,
    cuisine_type VARCHAR(100)
);

CREATE TABLE restaurant_tables (
    table_id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    table_number INT,
    capacity INT
);

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    table_id INT REFERENCES restaurant_tables(table_id),
    reservation_date DATE,
    reservation_time TIME
);
