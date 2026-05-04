-- 1. Ensure columns exist
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS menu_images TEXT[];

-- 2. Drop the old broken policies
DROP POLICY IF EXISTS "Users can only read and update their own data" ON users;
DROP POLICY IF EXISTS "Users can only read, insert, update their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can only read and update their own loyalty points" ON loyalty_points;

-- 3. Create the new correct policies matching Email to Email
CREATE POLICY "Users can only read and update their own data" ON users
  FOR ALL USING (email = auth.jwt()->>'email');

CREATE POLICY "Users can only read, insert, update their own reservations" ON reservations
  FOR ALL USING (
    user_id IN (SELECT user_id FROM users WHERE email = auth.jwt()->>'email')
  )
  WITH CHECK (
    user_id IN (SELECT user_id FROM users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Users can only read and update their own loyalty points" ON loyalty_points
  FOR ALL USING (
    user_id IN (SELECT user_id FROM users WHERE email = auth.jwt()->>'email')
  );

-- 4. FIX 409 CONFLICT ERRORS BY RESETTING SEQUENCES
-- This safely resets the ID generators so new reservations and tables work perfectly.
DO $$
DECLARE
  seq_name TEXT;
BEGIN
  -- Reset reservations sequence
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='reservation_id') THEN
    seq_name := pg_get_serial_sequence('reservations', 'reservation_id');
    IF seq_name IS NOT NULL THEN
      PERFORM setval(seq_name, COALESCE((SELECT MAX(reservation_id)+1 FROM reservations), 1), false);
    END IF;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='id') THEN
    seq_name := pg_get_serial_sequence('reservations', 'id');
    IF seq_name IS NOT NULL THEN
      PERFORM setval(seq_name, COALESCE((SELECT MAX(id)+1 FROM reservations), 1), false);
    END IF;
  END IF;

  -- Reset restaurant_tables sequence
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='restaurant_tables' AND column_name='table_id') THEN
    seq_name := pg_get_serial_sequence('restaurant_tables', 'table_id');
    IF seq_name IS NOT NULL THEN
      PERFORM setval(seq_name, COALESCE((SELECT MAX(table_id)+1 FROM restaurant_tables), 1), false);
    END IF;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='restaurant_tables' AND column_name='id') THEN
    seq_name := pg_get_serial_sequence('restaurant_tables', 'id');
    IF seq_name IS NOT NULL THEN
      PERFORM setval(seq_name, COALESCE((SELECT MAX(id)+1 FROM restaurant_tables), 1), false);
    END IF;
  END IF;
END $$;
