import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import RestaurantCard from '../components/RestaurantCard';
import { useRestaurants } from '../hooks/useRestaurants';

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState({ search: initialQuery });
  const { data: restaurants, loading, error } = useRestaurants(filters);
  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (initialQuery && filters.search !== initialQuery) {
      setFilters(prev => ({ ...prev, search: initialQuery }));
    }
  }, [initialQuery]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  let sortedRestaurants = [...restaurants];
  if (sortBy === 'Rating (High to Low)') {
    sortedRestaurants.sort((a, b) => Number(b.avg_rating) - Number(a.avg_rating));
  } else if (sortBy === 'Price (Low to High)') {
    const priceValue = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
    sortedRestaurants.sort((a, b) => (priceValue[a.price_range] || 0) - (priceValue[b.price_range] || 0));
  }

  const totalItems = sortedRestaurants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRestaurants = sortedRestaurants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">Discover Restaurants</h1>
        <p className="text-gray-400 text-sm">Find the perfect dining experience for any occasion</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar onApplyFilters={handleApplyFilters} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-0">
              Showing {totalItems} restaurants
            </span>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-primary font-medium"
              >
                <option value="Recommended">Recommended</option>
                <option value="Rating (High to Low)">Rating (High to Low)</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              Error fetching restaurants: {error}
            </div>
          ) : totalItems === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500">No restaurants found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-500 bg-[#f4ede4] hover:bg-white disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages).keys()].map(i => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 border rounded text-sm font-medium transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-[#ef5922] border-[#ef5922] text-white' 
                          : 'bg-[#f4ede4] border-gray-200 text-gray-500 hover:bg-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-500 bg-[#f4ede4] hover:bg-white disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
