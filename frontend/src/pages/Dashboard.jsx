// src/pages/Dashboard.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../component/Admin/Sidebar';
import DashboardHome from '../component/Admin/DashboardHome';
import ProductList from '../component/Admin/ProductList';
import UserList from '../component/Admin/UserList';
import OrderList from '../component/Admin/OrderList';
import OrderDetails from '../component/Admin/OrderDetails';
import OrderUpdate from '../component/Admin/OrderUpdate';
import CreateProduct from '../component/Admin/CreateProduct';

const Dashboard = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-grow">
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/new" element={<CreateProduct />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="orders/:id" element={<OrderDetails />} />
                    <Route path="orders/:id/update" element={<OrderUpdate />} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
