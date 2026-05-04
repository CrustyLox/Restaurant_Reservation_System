import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useRestaurants = (filters = {}) => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('restaurants')
          .select('*, restaurant_images(image_url, is_primary)');

        if (filters.search) {
          query = query.or(
            `restaurant_name.ilike.%${filters.search}%,cuisine.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
          );
        }
        if (filters.cuisines?.length > 0) {
          query = query.in('cuisine', filters.cuisines);
        }
        if (filters.priceRanges?.length > 0) {
          query = query.in('price_range', filters.priceRanges);
        }
        if (filters.minRating) {
          query = query.gte('avg_rating', filters.minRating);
        }

        const { data: rows, error: fetchError } = await query;

        if (cancelled) return;
        if (fetchError) throw fetchError;

        const list = (rows || []).map(r => ({
          ...r,
          image_url:
            r.restaurant_images?.find(img => img.is_primary)?.image_url ||
            r.restaurant_images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          // Guarantee hours so slot grids always populate
          opening_time: r.opening_time || '11:00:00',
          closing_time:  r.closing_time  || '23:00:00',
        }));

        setData(list);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load restaurants');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRestaurants();
    return () => { cancelled = true; };
    // Stringify filters so deep-equal comparison works correctly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
};
