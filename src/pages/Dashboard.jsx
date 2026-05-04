import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoyalty } from '../hooks/useLoyalty';
import { useReservations } from '../hooks/useReservations';
import { useRestaurants } from '../hooks/useRestaurants';
import RestaurantCard from '../components/RestaurantCard';
import { generateTimeSlots } from '../utils/helpers';
import { Search } from 'lucide-react';

const Dashboard = () => {
  const { user, dbUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { points } = useLoyalty(dbUser?.user_id);
  const { upcoming, past } = useReservations(dbUser?.user_id);
  
  // Get unique restaurants visited
  const visitedCount = new Set(past.filter(r => r.status === 'completed').map(r => r.restaurant_id)).size;
  
  const { data: restaurants, loading: restsLoading } = useRestaurants({});
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getAvailableSlotsTonight = (restaurant) => {
    // If opening time is missing, assume 11:00 to 23:00 as a fallback so we still show slots
    const openTime = restaurant.opening_time || '11:00:00';
    const closeTime = restaurant.closing_time || '23:00:00';
    const slots = generateTimeSlots(openTime, closeTime);
    return ['18:00:00', '19:30:00', '21:00:00'].filter(s => slots.includes(s));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">
          Welcome back, {user?.user_metadata?.user_name || 'Cherry'}!
        </h1>
        <p className="text-gray-400 text-sm">Ready to discover your next dining experience?</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-12 relative max-w-[480px]">
        <input
          type="text"
          placeholder="Search restaurants, cuisines, or locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-12 py-3.5 rounded-lg border border-gray-100 shadow-sm focus:outline-none focus:border-primary text-sm bg-white"
        />
        <button type="submit" className="absolute right-4 top-4 text-gray-400 hover:text-primary transition-colors">
          <Search size={18} />
        </button>
      </form>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100/50">
          <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-3">Upcoming Reservations</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{upcoming.length}</p>
          <p className="text-xs text-gray-400">Next: Tonight at 7:30 PM</p>
        </div>
        
        <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100/50">
          <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-3">Restaurants Visited</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{visitedCount}</p>
          <p className="text-xs text-gray-400">Since joining in 2023</p>
        </div>

        <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100/50">
          <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-3">Loyalty Points</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{points.toLocaleString()}</p>
          <p className="text-xs text-gray-400">760 to next reward</p>
        </div>
      </div>

      {/* Available Tonight Section */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-xl font-bold text-gray-900">Available Tonight</h2>
        <button 
          onClick={() => navigate('/search')}
          className="text-primary text-sm font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {restsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.slice(0, 6).map(restaurant => (
            <RestaurantCard 
              key={restaurant.restaurant_id} 
              restaurant={restaurant} 
              availableSlots={getAvailableSlotsTonight(restaurant)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
