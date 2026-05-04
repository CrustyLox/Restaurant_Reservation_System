CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location TEXT NOT NULL,
    cuisine_type VARCHAR(100),
    contact_number VARCHAR(15),
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_tables (
    table_id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    table_number INT NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE menu_items (
    menu_id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    item_name VARCHAR(120) NOT NULL,
    category VARCHAR(60),
    price DECIMAL(10,2),
    description TEXT
);

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    table_id INT REFERENCES restaurant_tables(table_id),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INT,
    status VARCHAR(20) DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_reservation_date ON reservations(reservation_date);
CREATE INDEX idx_restaurant_location ON restaurants(location);
