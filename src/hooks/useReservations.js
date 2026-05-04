import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useReservations = (userId) => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      // userId is still unknown (auth resolving) — stay in loading state
      if (userId === undefined || userId === null) {
        // Only stop loading if we're sure user is logged out (null from dbUser)
        // userId being undefined means dbUser hasn't resolved yet — keep spinner
        if (userId === null) setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            *,
            restaurants (
              restaurant_name,
              cuisine,
              avg_rating,
              restaurant_images (image_url, is_primary)
            )
          `)
          .eq('user_id', userId)
          .order('reservation_date', { ascending: false })
          .order('reservation_time', { ascending: false });

        if (error) throw error;

        const formatted = data.map(res => {
          const r = res.restaurants;
          const image = r?.restaurant_images?.find(img => img.is_primary)?.image_url 
                        || r?.restaurant_images?.[0]?.image_url;
          return {
            ...res,
            restaurant_name: r?.restaurant_name,
            cuisine: r?.cuisine,
            avg_rating: r?.avg_rating,
            image_url: image
          };
        });

        const today = new Date();
        today.setHours(0,0,0,0);

        const up = formatted.filter(r => {
          const resDate = new Date(r.reservation_date);
          const isPendingOrConfirmed = r.status === 'pending' || r.status === 'confirmed';
          return isPendingOrConfirmed && resDate >= today;
        });

        const pa = formatted.filter(r => {
          const resDate = new Date(r.reservation_date);
          const isCompletedOrCancelled = r.status === 'completed' || r.status === 'cancelled';
          return isCompletedOrCancelled || resDate < today;
        });

        setUpcoming(up);
        setPast(pa);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  return { upcoming, past, loading, error };
};
