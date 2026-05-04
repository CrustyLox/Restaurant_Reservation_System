import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useLoyalty = (userId) => {
  const [points, setPoints] = useState(0);
  const [threshold, setThreshold] = useState(2000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('loyalty_points')
          .select('total_points, next_reward_threshold')
          .eq('user_id', userId)
          .single();

        if (data) {
          setPoints(data.total_points);
          setThreshold(data.next_reward_threshold);
        }
      } catch (err) {
        console.error("Error fetching loyalty points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyalty();
  }, [userId]);

  return { points, threshold, loading };
};
