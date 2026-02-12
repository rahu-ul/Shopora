// src/components/FilterSidebar.jsx

import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiAdjustments, HiX } from 'react-icons/hi';
import { MdCategory, MdAttachMoney } from 'react-icons/md';

const FilterSidebar = ({ setPrice, price, setCategory, category, setRatings, ratings, onClose, categories = [] }) => {
  
  const handleCategoryClick = (newCategory) => {
    setCategory(category === newCategory ? '' : newCategory);
  };
  
  const handlePriceChange = (e) => {
    const maxPrice = Number(e.target.value);
    setPrice([0, maxPrice]);
  };

  const handleRatingsChange = (e) => {
    setRatings(Number(e.target.value));
  };

  const clearFilters = () => {
    setPrice([0, 1000000]);
    setCategory('');
    setRatings(0);
  };

  return (
    <div className="md:w-1/4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HiAdjustments className="text-2xl" />
            <h3 className="text-xl font-bold">Filters</h3>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <HiX className="text-xl" />
            </button>
          )}
        </div>
        <button 
          onClick={clearFilters}
          className="mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          Clear All
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Price Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-800">
            <MdAttachMoney className="text-xl text-blue-600" />
            <h4 className="text-lg font-bold">Price Range</h4>
          </div>
          
          <div className="relative pt-2">
            <input 
              type="range"
              value={price[1]}
              min="0"
              max="1000000"
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-5 
                       [&::-webkit-slider-thumb]:h-5 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-gradient-to-r 
                       [&::-webkit-slider-thumb]:from-blue-500 
                       [&::-webkit-slider-thumb]:to-purple-500
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-110
                       [&::-moz-range-thumb]:w-5 
                       [&::-moz-range-thumb]:h-5 
                       [&::-moz-range-thumb]:rounded-full 
                       [&::-moz-range-thumb]:bg-gradient-to-r 
                       [&::-moz-range-thumb]:from-blue-500 
                       [&::-moz-range-thumb]:to-purple-500
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:shadow-lg
                       [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(168 85 247) ${(price[1]/1000000)*100}%, rgb(229 231 235) ${(price[1]/1000000)*100}%, rgb(229 231 235) 100%)`
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">₹{Number(price[1]).toLocaleString()}</span>
            </div>
            <span className="text-sm text-gray-500">₹10,00,000</span>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-800">
            <MdCategory className="text-xl text-purple-600" />
            <h4 className="text-lg font-bold">Categories</h4>
          </div>
          
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  category === cat 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ratings Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-800">
            <AiFillStar className="text-xl text-yellow-500" />
            <h4 className="text-lg font-bold">Minimum Rating</h4>
          </div>
          
          <div className="relative pt-2">
            <input 
              type="range"
              value={ratings}
              min="0"
              max="5"
              step="0.5"
              onChange={handleRatingsChange}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-5 
                       [&::-webkit-slider-thumb]:h-5 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-gradient-to-r 
                       [&::-webkit-slider-thumb]:from-yellow-400 
                       [&::-webkit-slider-thumb]:to-orange-500
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-110
                       [&::-moz-range-thumb]:w-5 
                       [&::-moz-range-thumb]:h-5 
                       [&::-moz-range-thumb]:rounded-full 
                       [&::-moz-range-thumb]:bg-gradient-to-r 
                       [&::-moz-range-thumb]:from-yellow-400 
                       [&::-moz-range-thumb]:to-orange-500
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:shadow-lg
                       [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(251 191 36) 0%, rgb(249 115 22) ${(ratings/5)*100}%, rgb(229 231 235) ${(ratings/5)*100}%, rgb(229 231 235) 100%)`
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">{ratings}</span>
              <AiFillStar className="text-yellow-500" />
              <span className="text-sm text-gray-600 ml-1">& Up</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">5</span>
              <AiFillStar className="text-yellow-500" />
            </div>
          </div>

          {/* Star Rating Visual */}
          <div className="flex justify-center gap-1 pt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <AiFillStar
                key={star}
                className={`text-2xl transition-all duration-300 ${
                  star <= ratings ? 'text-yellow-400 scale-110' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(category || price[1] < 1000000 || ratings > 0) && (
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-blue-700 border border-blue-200">
                  {category}
                </span>
              )}
              {price[1] < 1000000 && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-700 border border-purple-200">
                  ₹{Number(price[1]).toLocaleString()}
                </span>
              )}
              {ratings > 0 && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-yellow-700 border border-yellow-200 flex items-center gap-1">
                  {ratings}+ <AiFillStar className="text-yellow-500" />
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
