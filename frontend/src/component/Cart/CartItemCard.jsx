// src/component/Cart/CartItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, index, onRemove, onIncrease, onDecrease }) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div 
      className="p-6 hover:bg-gray-50 transition-colors duration-200"
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.5s ease-out forwards'
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/product/${item.product}`}>
            <img
              src={item.image || 'https://via.placeholder.com/120x120?text=No+Image'}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex-grow">
              <Link 
                to={`/product/${item.product}`}
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <span>Product ID: {item.product.slice(-6)}</span>
                {item.stock <= 5 && (
                  <span className="text-orange-600 font-medium">
                    Only {item.stock} left in stock
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600">₹{item.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">per item</span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col items-end gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => onDecrease(item.product)}
                    disabled={item.quantity <= 1}
                    className={`px-3 py-1 rounded-l-lg transition-colors duration-200 ${
                      item.quantity <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="px-4 py-1 bg-white text-center min-w-[3rem] font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => onIncrease(item.product)}
                    disabled={item.quantity >= item.stock}
                    className={`px-3 py-1 rounded-r-lg transition-colors duration-200 ${
                      item.quantity >= item.stock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemove(item.product)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Remove from cart"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ₹{itemTotal.toLocaleString()}
                </div>
                {item.quantity > 1 && (
                  <div className="text-sm text-gray-500">
                    {item.quantity} × ₹{item.price.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.stock && (
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700 text-sm flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Maximum quantity reached
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CartItem;