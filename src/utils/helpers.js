export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export const generateTimeSlots = (openTime, closeTime) => {
  // Fallback to reasonable hours so we never return []
  const open = openTime || '11:00:00';
  const close = closeTime || '23:00:00';

  const slots = [];
  const [oHour, oMin] = open.split(':').map(Number);
  const [cHour, cMin] = close.split(':').map(Number);

  // Use a date-agnostic approach: work entirely in minutes since midnight
  const openMins = oHour * 60 + oMin;
  const closeMins = cHour * 60 + cMin;

  // Stop 30 min before closing so last slot isn't right at close
  for (let mins = openMins; mins < closeMins - 30; mins += 30) {
    const hh = Math.floor(mins / 60).toString().padStart(2, '0');
    const mm = (mins % 60).toString().padStart(2, '0');
    slots.push(`${hh}:${mm}:00`);
  }
  return slots;
};

export const getPriceLabel = (priceRange) => {
  const map = {
    '$': 'Budget',
    '$$': 'Moderate',
    '$$$': 'Expensive',
    '$$$$': 'Luxury',
  };
  return map[priceRange] || priceRange || '';
};

export const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  const map = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  return map[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
