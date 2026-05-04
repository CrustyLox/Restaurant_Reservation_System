import React from 'react';
import { formatTime } from '../utils/helpers';

const TimeSlotPicker = ({ slots, selectedSlot, onSelectSlot, bookedSlots = [] }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;
        
        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onSelectSlot(slot)}
            className={`
              py-2 px-1 text-sm font-medium rounded-lg border transition-colors
              ${isBooked ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 
                isSelected ? 'bg-primary text-white border-primary shadow-sm' : 
                'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
            `}
          >
            {formatTime(slot)}
          </button>
        );
      })}
      {slots.length === 0 && (
        <div className="col-span-full text-center py-4 text-gray-500 text-sm">
          No slots available for this date.
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
