import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateTimeSlots, formatTime } from '../utils/helpers';
import StarRating from '../components/StarRating';
import { MapPin, Clock } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dbUser } = useAuth();
  const { addToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [offers, setOffers] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('reserve');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch restaurant details ──────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: restData, error: restError } = await supabase
          .from('restaurants')
          .select('*, restaurant_images(image_url, is_primary), restaurant_tables(table_id, capacity)')
          .eq('restaurant_id', id)
          .maybeSingle();

        if (cancelled) return;
        if (restError) throw restError;
        if (!restData) { setError('Restaurant not found'); setLoading(false); return; }

        // Inject image + default hours
        const primaryImg =
          restData.restaurant_images?.find(img => img.is_primary)?.image_url ||
          restData.restaurant_images?.[0]?.image_url ||
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200';
        restData.image_url = primaryImg;
        restData.opening_time = restData.opening_time || '11:00:00';
        restData.closing_time = restData.closing_time || '23:00:00';

        setRestaurant(restData);

        const { data: offersData } = await supabase
          .from('offers')
          .select('*')
          .eq('restaurant_id', id)
          .gte('valid_until', new Date().toISOString());
        if (!cancelled) setOffers(offersData || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load restaurant');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetails();
    return () => { cancelled = true; };
  }, [id]);

  // ── Fetch booked slots whenever date changes ──────────────────────────────
  useEffect(() => {
    if (!restaurant) return;
    let cancelled = false;

    const fetchBookedSlots = async () => {
      try {
        const { data } = await supabase
          .from('reservations')
          .select('reservation_time')
          .eq('restaurant_id', id)
          .eq('reservation_date', date)
          .not('status', 'eq', 'cancelled');

        if (cancelled) return;
        setBookedSlots(data?.map(d => d.reservation_time) || []);
        setSelectedTime('');
      } catch (err) {
        console.error('Error fetching booked slots', err);
      }
    };

    fetchBookedSlots();
    return () => { cancelled = true; };
  }, [date, id, restaurant]);

  // ── Handle reservation submit ─────────────────────────────────────────────
  const handleReserve = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-submit

    if (!selectedTime) {
      addToast('Please select a time slot', 'error');
      return;
    }
    if (!dbUser) {
      addToast('Your profile is still loading — please wait a moment and try again.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // ── Step 1: Find or create a suitable table ──────────────────────────
      let tableId = null;

      // Look for an existing table with enough capacity
      const existingTable = restaurant.restaurant_tables?.find(t => t.capacity >= guests);
      if (existingTable) {
        tableId = existingTable.table_id;
      } else {
        // Auto-create a table row so reservation can always proceed
        const { data: newTable, error: tableError } = await supabase
          .from('restaurant_tables')
          .insert({
            restaurant_id: parseInt(id),
            table_number: Math.floor(Math.random() * 9000) + 1000, // random 4-digit int
            capacity: parseInt(guests),
          })
          .select('table_id')
          .maybeSingle();

        if (tableError || !newTable) {
          throw new Error(tableError?.message || 'Could not allocate a table');
        }
        tableId = newTable.table_id;
      }

      // ── Step 2: Insert the reservation ───────────────────────────────────
      const { error: resError } = await supabase
        .from('reservations')
        .insert({
          user_id: dbUser.user_id,
          restaurant_id: parseInt(id),
          table_id: tableId,
          reservation_date: date,
          reservation_time: selectedTime,
          guests: parseInt(guests),
          status: 'pending',
          special_requests: specialRequests || null,
        });

      if (resError) throw resError;

      addToast('🎉 Reservation confirmed!', 'success');
      // Hard redirect ensures MyBookings fetches fresh data instead of using stale cache
      setTimeout(() => { window.location.href = '/my-bookings'; }, 800);
    } catch (err) {
      console.error('Reservation error:', err);
      addToast(err.message || 'Failed to confirm reservation. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ef5922]"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'This restaurant does not exist.'}</p>
        <button
          onClick={() => navigate('/search')}
          className="bg-[#ef5922] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#d94a1a] transition-colors"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];
  const allSlots = generateTimeSlots(restaurant.opening_time, restaurant.closing_time);

  return (
    <div className="bg-[#f5efe8] min-h-screen pb-12">
      {/* Hero Image */}
      <div className="w-full h-[300px] overflow-hidden">
        <img
          src={restaurant.image_url}
          alt={restaurant.restaurant_name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'; }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">{restaurant.restaurant_name}</h1>
            <span className="bg-[#ef5922] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
              {restaurant.cuisine}
            </span>
          </div>

          <div className="flex items-center text-sm mb-4">
            <StarRating rating={restaurant.avg_rating} totalReviews={restaurant.total_reviews} />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-600 font-medium">
            <span className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-400" />
              {restaurant.location}
            </span>
            <span className="flex items-center">
              <Clock size={16} className="mr-2 text-gray-400" />
              Mon–Sun: {formatTime(restaurant.opening_time)} – {formatTime(restaurant.closing_time)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {['reserve', 'menu'].map(tab => (
            <button
              key={tab}
              className={`py-3 px-6 text-sm font-bold transition-colors ${
                activeTab === tab
                  ? 'border-b-[3px] border-[#ef5922] text-[#ef5922]'
                  : 'text-gray-400 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'reserve' ? 'Reserve a Table' : 'Menu'}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="w-full lg:w-2/3">
            {activeTab === 'reserve' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-8">Make a Reservation</h2>

                <form onSubmit={handleReserve}>
                  {/* Date */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#ef5922] text-sm"
                      required
                    />
                  </div>

                  {/* Time Slots */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      Select Time
                    </label>
                    {allSlots.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No time slots available for this restaurant.</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-3">
                        {allSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-1 text-xs font-semibold rounded border transition-colors ${
                                isBooked
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#ef5922] text-white border-[#ef5922]'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#ef5922] hover:text-[#ef5922]'
                              }`}
                            >
                              {formatTime(slot)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Party Size */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Party Size
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-md py-3 px-4 focus:outline-none focus:border-[#ef5922] text-sm"
                      required
                    >
                      {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-8">
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-md py-3 px-4 focus:outline-none focus:border-[#ef5922] text-sm resize-none h-24"
                      placeholder="Any dietary restrictions, allergies, or special occasions..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedTime}
                    className="w-full bg-[#ef5922] hover:bg-[#d94a1a] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-md font-semibold transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Confirming…</span>
                      </div>
                    ) : (
                      'Confirm Reservation'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Menu Tab */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Menu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurant.menu_images && restaurant.menu_images.length > 0 ? (
                    restaurant.menu_images.map((menuImg, idx) => (
                      <div key={idx} className="border border-gray-200 p-2 rounded-lg">
                        <img src={menuImg} alt={`Menu page ${idx + 1}`} className="w-full h-auto rounded object-contain" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border border-gray-200 p-2 rounded-lg">
                        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000" alt="Menu" className="w-full h-auto rounded object-contain" />
                      </div>
                      <div className="border border-gray-200 p-2 rounded-lg">
                        <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000" alt="Menu" className="w-full h-auto rounded object-contain" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Offers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5 text-sm">Offers</h3>
              <div className="space-y-4">
                {offers.length > 0 ? (
                  offers.map(offer => (
                    <div key={offer.offer_id} className="relative flex overflow-hidden rounded-lg shadow-sm border border-purple-100/50">
                      <div className="bg-gradient-to-br from-indigo-400 to-purple-400 w-24 flex items-center justify-center p-3 text-white font-bold text-center leading-tight">
                        {offer.discount_percent}% OFF
                      </div>
                      <div className="bg-purple-50/50 flex-1 p-3 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-900">{offer.title}</p>
                        <p className="text-xs text-gray-500">Valid until {new Date(offer.valid_until).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No active offers at the moment.</p>
                )}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">About</h3>
              {restaurant.description && (
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{restaurant.description}</p>
              )}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-900">Cost</p>
                <p className="text-xs text-gray-500">₹{restaurant.cost_for_two || '1500'} for two</p>
              </div>
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-900">Cuisine</p>
                <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
              </div>
              {restaurant.facilities && restaurant.facilities.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-900 mb-2">Facilities</p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {restaurant.facilities.map((fac, i) => (
                      <div key={i} className="flex items-center text-[10px] text-gray-500">
                        <span className="w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                        {fac}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
