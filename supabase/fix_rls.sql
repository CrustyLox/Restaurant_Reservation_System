-- 1. Ensure columns exist (safe to run even if they already exist)
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- 2. Drop the old broken policies
DROP POLICY IF EXISTS "Users can only read and update their own data" ON users;
DROP POLICY IF EXISTS "Users can only read, insert, update their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can only read and update their own loyalty points" ON loyalty_points;

-- 3. Create the new correct policies matching Email to Email
CREATE POLICY "Users can only read and update their own data" ON users
  FOR ALL USING (
    email = auth.jwt()->>'email'
  );

CREATE POLICY "Users can only read, insert, update their own reservations" ON reservations
  FOR ALL USING (
    user_id IN (
      SELECT user_id FROM users WHERE email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT user_id FROM users WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can only read and update their own loyalty points" ON loyalty_points
  FOR ALL USING (
    user_id IN (
      SELECT user_id FROM users WHERE email = auth.jwt()->>'email'
    )
  );
