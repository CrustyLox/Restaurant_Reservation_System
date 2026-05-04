import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import { supabase } from '../supabase/client';

// Since there is no favorites table in the schema, we'll store favorite restaurant IDs in localStorage 
// and fetch their details from Supabase.
const Favorites = () => {
  const { user } = useAuth();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // Get favorite IDs from localStorage (simulating a favorites feature)
        const storageKey = `favorites_${user?.id}`;
        const storedFavorites = JSON.parse(localStorage.getItem(storageKey) || '[]');

        if (storedFavorites.length === 0) {
          setFavoriteRestaurants([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('restaurants')
          .select('*, restaurant_images(image_url, is_primary)')
          .in('restaurant_id', storedFavorites);

        if (error) throw error;

        const formatted = data.map(rest => {
          const primaryImg = rest.restaurant_images?.find(img => img.is_primary)?.image_url 
                          || rest.restaurant_images?.[0]?.image_url;
          return { ...rest, image_url: primaryImg };
        });

        setFavoriteRestaurants(formatted);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">Favorites</h1>
        <p className="text-gray-400 text-sm">Your saved restaurants</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : favoriteRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRestaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.restaurant_id} 
              restaurant={restaurant} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">Start exploring restaurants and save your favorites here.</p>
          <a href="/search" className="bg-[#ef5922] text-white px-6 py-2 rounded-md font-medium">Discover Restaurants</a>
        </div>
      )}
    </div>
  );
};

export default Favorites;
