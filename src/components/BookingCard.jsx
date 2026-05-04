import React from 'react';
import { formatDate, formatTime } from '../utils/helpers';
import { Calendar, Clock, Users } from 'lucide-react';
import StarRating from './StarRating';

const BookingCard = ({ booking, onModify, onCancel }) => {
  const isUpcoming = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div className="bg-white rounded-[12px] flex flex-col md:flex-row overflow-hidden border border-gray-100 shadow-sm mb-6">
      <div className="md:w-[280px] h-48 md:h-auto shrink-0">
        <img 
          src={booking.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
          alt={booking.restaurant_name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-bold text-xl text-gray-900 leading-tight">{booking.restaurant_name}</h3>
            <p className="text-[10px] font-bold text-[#ef5922] uppercase tracking-wider mt-1">{booking.cuisine}</p>
          </div>
          {booking.status === 'confirmed' && (
            <span className="bg-[#10b981] text-white text-xs font-semibold px-3 py-1 rounded-sm">
              Confirmed
            </span>
          )}
          {booking.status === 'pending' && (
            <span className="bg-[#f59e0b] text-white text-xs font-semibold px-3 py-1 rounded-sm">
              Pending
            </span>
          )}
          {booking.status === 'cancelled' && (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-sm">
              Cancelled
            </span>
          )}
        </div>

        <div className="mb-4">
          <StarRating rating={booking.avg_rating} showReviews={false} />
        </div>

        <div className="flex items-center gap-8 mb-6">
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar size={14} className="mr-2" />
            <span className="font-medium">{formatDate(booking.reservation_date)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Clock size={14} className="mr-2" />
            <span className="font-medium">{formatTime(booking.reservation_time)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Users size={14} className="mr-2" />
            <span className="font-medium">{booking.guests} Guests</span>
          </div>
        </div>

        {isUpcoming && (
          <div className="flex gap-3 mt-auto border-t border-gray-100 pt-5">
            <button 
              onClick={() => onModify(booking)}
              className="py-2 px-5 border border-[#ef5922] rounded text-sm font-semibold text-[#ef5922] hover:bg-orange-50 transition-colors"
            >
              Modify Booking
            </button>
            <button 
              onClick={() => onCancel(booking)}
              className="py-2 px-5 bg-[#ef4444] border border-[#ef4444] rounded text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
