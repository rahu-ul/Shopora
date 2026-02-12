// src/pages/OrderSuccess.jsx

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <FaCheckCircle className="text-green-500 text-7xl mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
            <Link to="/orders" className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-200">
                View My Orders
            </Link>
        </div>
    );
};

export default OrderSuccess;