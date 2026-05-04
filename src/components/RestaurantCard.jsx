import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { getPriceLabel } from '../utils/helpers';
import { formatTime } from '../utils/helpers';

const RestaurantCard = ({ restaurant, availableSlots = [] }) => {
  return (
    <div className="card overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
          alt={restaurant.restaurant_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-900 truncate pr-2">{restaurant.restaurant_name}</h3>
          <div className="flex items-center bg-[#f5a623] px-2 py-0.5 rounded text-xs shrink-0 text-white font-bold">
            <span className="text-white text-[10px] mr-1">★</span>
            <span>{restaurant.avg_rating}</span>
          </div>
        </div>
        
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
          {restaurant.cuisine}
        </div>

        <div className="flex items-center text-gray-400 text-xs mb-5">
          <span className="truncate">{restaurant.neighbourhood || restaurant.location || 'Unknown Location'}</span>
          {restaurant.price_range && (
            <>
              <span className="mx-1">•</span>
              <span>{getPriceLabel(restaurant.price_range)}</span>
            </>
          )}
          {restaurant.dining_style && (
            <>
              <span className="mx-1">•</span>
              <span>{restaurant.dining_style}</span>
            </>
          )}
        </div>

        {availableSlots.length > 0 && (
          <div className="mb-5 mt-auto">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Available Times</p>
            <div className="flex flex-wrap gap-2">
              {availableSlots.slice(0, 3).map((slot, i) => (
                <span key={i} className="text-xs bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary px-3 py-1.5 rounded cursor-pointer transition-colors font-medium">
                  {formatTime(slot)}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link 
          to={`/restaurant/${restaurant.restaurant_id}`}
          className="w-full bg-[#ef5922] hover:bg-[#d94a1a] text-white text-center font-medium py-2.5 rounded transition-colors text-sm"
        >
          {availableSlots.length > 0 ? 'Reserve Now' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
