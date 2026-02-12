// src/components/Pagination.jsx

import React from 'react';

const Pagination = ({ productsCount, resultPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(productsCount / resultPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pages = [...Array(totalPages).keys()].map(i => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
