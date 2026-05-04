import React, { useState } from 'react';
import { Search } from 'lucide-react';

const cuisinesList = ['Italian', 'Japanese', 'French', 'Indian', 'American', 'Mediterranean', 'Chinese', 'Seafood'];
const pricesList = ['$', '$$', '$$$', '$$$$'];

const FilterSidebar = ({ onApplyFilters }) => {
  const [search, setSearch] = useState('');
  const [cuisines, setCuisines] = useState([]);
  const [prices, setPrices] = useState([]);
  const [minRating, setMinRating] = useState('');

  const handleCuisineChange = (c) => {
    setCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handlePriceChange = (p) => {
    setPrices(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleApply = () => {
    onApplyFilters({ search, cuisines, priceRanges: prices, minRating: minRating ? Number(minRating) : null });
  };

  const handleClear = () => {
    setSearch('');
    setCuisines([]);
    setPrices([]);
    setMinRating('');
    onApplyFilters({});
  };

  return (
    <div className="bg-surface rounded-card shadow-card p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-gray-900">Filters</h2>
        <button onClick={handleClear} className="text-sm text-primary hover:underline font-medium">Clear All</button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search restaurants..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Cuisines */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Cuisine</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {cuisinesList.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={cuisines.includes(c)}
                  onChange={() => handleCuisineChange(c)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Price Range</h3>
          <div className="flex flex-wrap gap-2">
            {pricesList.map(p => (
              <button
                key={p}
                onClick={() => handlePriceChange(p)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition-colors
                  ${prices.includes(p) ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Minimum Rating</h3>
          <div className="space-y-2">
            {[
              { label: 'Any', value: '' },
              { label: '5.0 Only', value: '5.0' },
              { label: '4.0+', value: '4.0' },
              { label: '3.0+', value: '3.0' }
            ].map(r => (
              <label key={r.value} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="rating"
                  checked={minRating === r.value}
                  onChange={() => setMinRating(r.value)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={handleApply}
          className="btn-primary w-full shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
