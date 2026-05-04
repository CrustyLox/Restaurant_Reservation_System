INSERT INTO users(name,email,phone,password) VALUES
('Pranav','pranav@gmail.com','9876543211','pass123'),
('Aryan','aryan@gmail.com','9876543212','pass123'),
('Charith','charith@gmail.com','9876543213','pass123'),
('Shanvi','shanvi@gmail.com','9876543214','pass123'),
('Sreethan','sreethan@gmail.com','9876543215','pass123'),
('Swetha','swetha@gmail.com','9876543216','pass123'),
('Sejal','sejal@gmail.com','9876543217','pass123');

INSERT INTO restaurants(name,location,cuisine_type,contact_number,opening_time,closing_time) VALUES
('AnTeRa','Jubliee Hills','Indian','9000011111','10:00','23:00'),
('Malibu','Kompally','Italian','9000022222','11:00','22:30'),
('BBQ Nation','Gachibowli','Barbecue','9000033333','12:00','23:30'),
('Basil Bistro','Kompally','Pizza','9000044444','10:00','22:00'),
('Moai','Financial District','Continental','9000055555','12:00','22:00'),
('IronHill','Madhapur','Cafe','9000066666','09:00','23:00'),
('Zythum','Jubliee HIlls','North Indian','9000077777','11:00','23:00'),
('MamaLola Penthouse','Gachibowli','Cafe','9000088888','08:00','21:00'),
('Makau','Jubliee HIlls','Continental','9000099999','12:00','22:30'),
('Pista House','Hyderabad','Multi Cuisine','9000012121','11:00','23:30');

INSERT INTO restaurant_tables(restaurant_id,table_number,capacity) VALUES
(1,1,4),(1,2,2),(1,3,6),
(2,1,4),(2,2,4),
(3,1,6),(3,2,6),
(4,1,2),(5,1,4),(6,1,4);

INSERT INTO menu_items(restaurant_id,item_name,category,price) VALUES
(1,'Paneer Butter Masala','Main Course',250),
(1,'Butter Naan','Bread',40),
(2,'Margherita Pizza','Pizza',350),
(2,'Pasta Alfredo','Pasta',300),
(3,'BBQ Chicken','Grill',450),
(4,'Veg Pizza','Pizza',300),
(5,'Sushi Roll','Japanese',500),
(6,'Cheese Burger','Burger',200),
(7,'Tandoori Chicken','Grill',400),
(8,'Cold Coffee','Beverage',150);

INSERT INTO reservations(user_id,restaurant_id,table_id,reservation_date,reservation_time,number_of_guests) VALUES
(1,1,1,'2026-03-10','19:00',3),
(2,2,4,'2026-03-11','20:00',4),
(3,3,6,'2026-03-12','18:30',5),
(4,4,8,'2026-03-13','19:30',2),
(5,5,9,'2026-03-14','20:30',4),
(6,6,10,'2026-03-15','18:00',3),
(7,7,7,'2026-03-16','21:00',6),
(8,8,1,'2026-03-17','10:00',2),
(9,9,2,'2026-03-18','19:15',3),
(10,10,3,'2026-03-19','20:45',5);
