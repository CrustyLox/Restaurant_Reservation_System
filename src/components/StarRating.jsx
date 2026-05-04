import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, totalReviews, showReviews = true }) => {
  // Ensure rating is between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));
  
  return (
    <div className="flex items-center">
      <div className="flex text-orange-500 mr-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= Math.round(normalizedRating) ? 'fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="font-bold text-gray-900 mr-1">{normalizedRating.toFixed(1)}</span>
      {showReviews && totalReviews !== undefined && (
        <span className="text-gray-500 text-sm">({totalReviews} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
