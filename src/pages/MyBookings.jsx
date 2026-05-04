import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../hooks/useReservations';
import BookingCard from '../components/BookingCard';
import { supabase } from '../supabase/client';
import { useToast } from '../context/ToastContext';

const MyBookings = () => {
  const { dbUser } = useAuth();
  const { upcoming, past, loading } = useReservations(dbUser?.user_id);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { addToast } = useToast();

  // Show spinner while auth is still resolving (dbUser not yet set)
  const isResolving = !dbUser && loading;

  const handleCancel = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('reservation_id', booking.reservation_id);
        
      if (error) throw error;
      
      addToast('Reservation cancelled successfully.', 'success');
      window.location.reload(); 
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleModify = (booking) => {
    addToast('Modify functionality is coming soon!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">My Bookings</h1>
        <p className="text-gray-400 text-sm">Manage your reservations and past dining experiences</p>
      </div>

      <div className="flex space-x-6 border-b border-gray-200 mb-8">
        <button
          className={`py-3 text-sm font-bold transition-colors ${
            activeTab === 'upcoming'
              ? 'border-b-[3px] border-[#ef5922] text-[#ef5922]'
              : 'border-b-[3px] border-transparent text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`py-3 text-sm font-bold transition-colors ${
            activeTab === 'past'
              ? 'border-b-[3px] border-[#ef5922] text-[#ef5922]'
              : 'border-b-[3px] border-transparent text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      {(loading || isResolving) ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-w-4xl">
          {activeTab === 'upcoming' && (
            upcoming.length > 0 ? (
              upcoming.map(booking => (
                <BookingCard 
                  key={booking.reservation_id} 
                  booking={booking} 
                  onCancel={handleCancel}
                  onModify={handleModify}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500">You don't have any upcoming reservations.</p>
              </div>
            )
          )}

          {activeTab === 'past' && (
            past.length > 0 ? (
              past.map(booking => (
                <BookingCard 
                  key={booking.reservation_id} 
                  booking={booking} 
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500">You haven't visited any restaurants yet.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
