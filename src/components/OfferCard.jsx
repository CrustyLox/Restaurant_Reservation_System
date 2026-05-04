import React from 'react';
import { Tag } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const OfferCard = ({ offer }) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
      <div className="absolute -right-6 -top-6 text-orange-200 opacity-50">
        <Tag size={100} />
      </div>
      <div className="relative z-10">
        <h4 className="font-bold text-orange-800 text-lg mb-1">{offer.title}</h4>
        <div className="flex justify-between items-end mt-4">
          <p className="text-xs text-orange-600 font-medium">
            Valid until {formatDate(offer.valid_until)}
          </p>
          <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {offer.discount_percent}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
