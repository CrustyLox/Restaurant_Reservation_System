import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      user_id: 1,
      restaurant_id: 1,
      table_id: 1,
      reservation_date: '2026-04-20',
      reservation_time: '19:00:00',
      guests: 2,
      status: 'pending',
      special_requests: 'Test'
    });
  console.log("Insert Error:", error);
}

testInsert();
