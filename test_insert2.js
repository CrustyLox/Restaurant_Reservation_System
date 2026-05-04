import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: user, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'cherry@demo.com',
    password: '123456'
  });
  console.log("Auth:", authErr ? authErr.message : "Success");
  
  if (user?.user) {
    // Try to insert a reservation
    const { error: resErr } = await supabase
      .from('reservations')
      .insert({
        user_id: 1, // assuming 1
        restaurant_id: 1,
        table_id: 2, // assuming 2 exists
        reservation_date: '2026-04-20',
        reservation_time: '19:00:00',
        guests: 2,
        status: 'pending',
        special_requests: ''
      });
      console.log("Reservation Insert:", resErr);
  }
}

check();
