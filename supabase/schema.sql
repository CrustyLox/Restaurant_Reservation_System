-- 1. Create Offers Table
CREATE TABLE offers (
  offer_id SERIAL PRIMARY KEY,
  restaurant_id INT4 REFERENCES restaurants(restaurant_id),
  title VARCHAR,
  discount_percent INT4,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  slots_remaining INT4,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Loyalty Points Table
CREATE TABLE loyalty_points (
  loyalty_id SERIAL PRIMARY KEY,
  user_id INT4 REFERENCES users(user_id),
  total_points INT4 DEFAULT 0,
  next_reward_threshold INT4 DEFAULT 2000,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Restaurant Images Table
CREATE TABLE restaurant_images (
  image_id SERIAL PRIMARY KEY,
  restaurant_id INT4 REFERENCES restaurants(restaurant_id),
  image_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Alter Reservations
ALTER TABLE reservations ADD COLUMN special_requests TEXT;

-- 5. Alter Restaurants
ALTER TABLE restaurants
  ADD COLUMN price_range VARCHAR,
  ADD COLUMN dining_style VARCHAR,
  ADD COLUMN neighbourhood VARCHAR,
  ADD COLUMN cost_for_two INT4,
  ADD COLUMN facilities TEXT[],
  ADD COLUMN additional_cuisines TEXT[],
  ADD COLUMN description TEXT,
  ADD COLUMN total_reviews INT4 DEFAULT 0;

-- 6. RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read and update their own data" ON users
  FOR ALL USING (auth.uid()::text = user_id::text);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read, insert, update their own reservations" ON reservations
  FOR ALL USING (auth.uid()::text = user_id::text);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read and update their own loyalty points" ON loyalty_points
  FOR ALL USING (auth.uid()::text = user_id::text);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read offers" ON offers FOR SELECT USING (true);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read restaurants" ON restaurants FOR SELECT USING (true);

ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tables" ON restaurant_tables FOR SELECT USING (true);

ALTER TABLE restaurant_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read images" ON restaurant_images FOR SELECT USING (true);

-- 7. Postgres Triggers

-- Trigger 1: On new Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, email, created_at)
  VALUES (new.id::int4, new.email, new.created_at);
  
  INSERT INTO public.loyalty_points (user_id, total_points)
  VALUES (new.id::int4, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In a real Supabase environment, the trigger attaches to auth.users.
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger 2: On new review insert
CREATE OR REPLACE FUNCTION public.update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET avg_rating = (
        SELECT ROUND(AVG(rating), 1) FROM reviews WHERE restaurant_id = NEW.restaurant_id
      ),
      total_reviews = (
        SELECT COUNT(*) FROM reviews WHERE restaurant_id = NEW.restaurant_id
      )
  WHERE restaurant_id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_added
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_restaurant_rating();

-- Trigger 3: On reservation completed -> Add Loyalty Points
CREATE OR REPLACE FUNCTION public.add_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE loyalty_points
    SET total_points = total_points + 100
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reservation_completed
  AFTER UPDATE ON reservations
  FOR EACH ROW EXECUTE PROCEDURE public.add_loyalty_points();

-- Trigger 4: On reservation cancel (soft delete)
-- Handled by application logic updating status to 'cancelled', no trigger needed to soft delete if it's just an update.
-- If user requested trigger specifically:
CREATE OR REPLACE FUNCTION prevent_hard_delete_reservation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reservations SET status = 'cancelled' WHERE reservation_id = OLD.reservation_id;
  RETURN NULL; -- Cancel the actual deletion
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soft_delete_reservation
  BEFORE DELETE ON reservations
  FOR EACH ROW EXECUTE PROCEDURE prevent_hard_delete_reservation();


-- 8. Seed Data

-- Assuming a demo user exists with ID 1
INSERT INTO users (user_id, user_name, email, phone, password_hash) 
VALUES (1, 'Cherry', 'cherry@demo.com', '1234567890', 'dummy_hash_value') ON CONFLICT DO NOTHING;

INSERT INTO loyalty_points (user_id, total_points) 
VALUES (1, 1240) ON CONFLICT DO NOTHING;

-- 10 Restaurants
INSERT INTO restaurants (restaurant_id, restaurant_name, location, cuisine, opening_time, closing_time, avg_rating, price_range, dining_style, neighbourhood, cost_for_two, facilities, additional_cuisines, description) VALUES
(1, 'AnTeRa', 'Jubilee Hills', 'Indian', '11:00:00', '23:00:00', 4.8, '$$', 'Casual Dining', 'Jubilee Hills', 1200, ARRAY['Valet Parking', 'Bar', 'Outdoor Seating'], ARRAY['Andhra', 'Telangana'], 'Authentic Telugu cuisine in a premium setting.'),
(2, 'Tiger Lilly', 'Gachibowli', 'Japanese', '11:00:00', '23:00:00', 4.9, '$$$', 'Casual Dining', 'Gachibowli', 2000, ARRAY['Sushi Bar', 'Live Music'], ARRAY['Asian'], 'A beautiful botanical-themed pan-asian bistro.'),
(3, 'Paul''s', 'Knowledge City', 'French', '11:00:00', '23:00:00', 4.7, '$$$$', 'Upscale', 'Knowledge City', 3000, ARRAY['Valet Parking', 'Fine Wine'], ARRAY['European'], 'Classic French dining experience.'),
(4, 'Glass Onion', 'Kokapet', 'Indian', '11:00:00', '23:00:00', 4.6, '$$', 'Casual Dining', 'Kokapet', 1500, ARRAY['Golf Course View', 'Bar'], ARRAY['Continental'], 'Scenic dining with a diverse menu.'),
(5, 'Moai', 'Financial District', 'Seafood', '11:00:00', '23:00:00', 4.8, '$$$', 'Casual Upscale', 'Financial District', 2500, ARRAY['Valet Parking', 'Private Dining'], ARRAY['Asian'], 'Premium seafood and cocktails.'),
(6, 'Nando''s', 'Financial District', 'American', '11:00:00', '23:00:00', 4.7, '$$', 'Cafe', 'Financial District', 1000, ARRAY['Takeaway', 'Delivery'], ARRAY['African'], 'World famous flame-grilled PERi-PERi chicken.'),
(7, 'Malibu', 'Kompally', 'French', '11:00:00', '23:00:00', 4.9, '$$$', 'Fine Dining', 'Kompally', 2200, ARRAY['Valet Parking', 'Romantic'], ARRAY['Mediterranean'], 'A sophisticated coastal dining experience.'),
(8, 'Heart Cup Cafe', 'Kondapur', 'Italian', '11:00:00', '23:00:00', 4.7, '$$', 'Casual', 'Kondapur', 1400, ARRAY['Live Music', 'Bar', 'Dance Floor'], ARRAY['Continental', 'Indian'], 'Popular hangout spot with great food and drinks.'),
(9, 'WOW! China', 'Financial District', 'Chinese', '11:00:00', '23:00:00', 4.9, '$$', 'Casual', 'Financial District', 800, ARRAY['Takeaway'], ARRAY['Asian'], 'Fast, fresh, and flavorful Chinese cuisine.'),
(10, 'Iron Hill', 'Madhapur', 'French', '11:00:00', '23:00:00', 4.8, '$$$', 'Fine Dining', 'Madhapur', 2400, ARRAY['Microbrewery', 'Outdoor Seating'], ARRAY['Continental'], 'Spacious microbrewery with excellent food pairings.')
ON CONFLICT DO NOTHING;

-- Images
INSERT INTO restaurant_images (restaurant_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', true),
(2, 'https://images.unsplash.com/photo-1552566626-52f8b828add9', true),
(3, 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c', true),
(4, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b', true),
(5, 'https://images.unsplash.com/photo-1559339352-11d035aa65de', true),
(6, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', true),
(7, 'https://images.unsplash.com/photo-1544148103-0773bf10d330', true),
(8, 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31', true),
(9, 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6', true),
(10, 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae', true)
ON CONFLICT DO NOTHING;

-- Tables (3 per restaurant)
DO $$
DECLARE
  r_id INT;
BEGIN
  FOR r_id IN 1..10 LOOP
    INSERT INTO restaurant_tables (restaurant_id, table_number, capacity) VALUES
    (r_id, 1, 2),
    (r_id, 2, 4),
    (r_id, 3, 6);
  END LOOP;
END $$;

-- Offers (2 per restaurant)
DO $$
DECLARE
  r_id INT;
BEGIN
  FOR r_id IN 1..10 LOOP
    INSERT INTO offers (restaurant_id, title, discount_percent, valid_from, valid_until, slots_remaining) VALUES
    (r_id, 'Flat 15% OFF (All Day)', 15, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', 50),
    (r_id, 'Flat 30% OFF (From 4 PM)', 30, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', 20);
  END LOOP;
END $$;

-- Reservations (2 for Demo User Cherry)
INSERT INTO reservations (reservation_id, user_id, restaurant_id, table_id, reservation_date, reservation_time, guests, status, special_requests) VALUES
(1, 1, 1, 2, CURRENT_DATE + INTERVAL '2 days', '19:00:00', 4, 'confirmed', 'Window seat preferred'),
(2, 1, 2, 4, CURRENT_DATE + INTERVAL '3 days', '20:30:00', 2, 'pending', 'Anniversary celebration')
ON CONFLICT DO NOTHING;
