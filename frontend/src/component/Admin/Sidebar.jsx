// src/components/Admin/Sidebar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaList, FaUser, FaChevronDown } from 'react-icons/fa';

const Sidebar = () => {
    const [openProducts, setOpenProducts] = useState(false);

    return (
        <div className="md:w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
            <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
            <nav className="flex-1 space-y-2">
                <Link to="/admin/dashboard" className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">
                    <FaTachometerAlt /> Dashboard
                </Link>

                {/* Products Dropdown */}
                <div className="cursor-pointer">
                    <div
                        onClick={() => setOpenProducts(!openProducts)}
                        className="flex items-center justify-between py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <FaBox /> Products
                        </div>
                        <FaChevronDown className={`transform transition-transform duration-200 ${openProducts ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                    {openProducts && (
                        <div className="ml-6 mt-1 space-y-1">
                            <Link to="/admin/dashboard/products" className="block py-2 px-4 rounded-md text-sm hover:bg-gray-700 transition-colors duration-200">
                                All Products
                            </Link>
                            <Link to="/admin/dashboard/products/new" className="block py-2 px-4 rounded-md text-sm hover:bg-gray-700 transition-colors duration-200">
                                Create Product
                            </Link>
                        </div>
                    )}
                </div>

                <Link to="/admin/dashboard/orders" className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">
                    <FaList /> Orders
                </Link>
                <Link to="/admin/dashboard/users" className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">
                    <FaUser /> Users
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
