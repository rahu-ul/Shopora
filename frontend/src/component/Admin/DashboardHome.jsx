// src/components/Admin/DashboardHome.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Package,
    Users,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Download,
    Plus,
    Calendar,
    DollarSign,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Sparkles,
    BarChart3,
    Activity,
    Box,
    Zap,
    Star
} from 'lucide-react';

const DashboardHome = () => {
    const { user } = useSelector(state => state.user);
    const [recentOrders, setRecentOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState('');
    const [recentProducts, setRecentProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const stats = [
        { 
            title: 'Total Products', 
            value: '120', 
            change: '+12.5%', 
            positive: true, 
            icon: Package,
            link: '/admin/dashboard/products',
            linkText: 'View Products',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
        },
        { 
            title: 'Total Users', 
            value: '50', 
            change: '+23.1%', 
            positive: true, 
            icon: Users,
            link: '/admin/dashboard/users',
            linkText: 'View Users',
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50'
        },
        { 
            title: 'Total Orders', 
            value: '25', 
            change: '+8.2%', 
            positive: true, 
            icon: ShoppingBag,
            link: '/admin/dashboard/orders',
            linkText: 'View Orders',
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50'
        },
        { 
            title: 'Revenue', 
            value: '₹45,890', 
            change: '+15.3%', 
            positive: true, 
            icon: DollarSign,
            link: '/admin/dashboard/orders',
            linkText: 'View Details',
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-50 to-amber-50'
        },
    ];

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                setOrdersLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/orders`, {
                    withCredentials: true
                });
                const orders = data.orders || [];
                setAllOrders(orders);
                const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentOrders(sorted.slice(0, 5));
                setOrdersError('');
            } catch (err) {
                setOrdersError(err.response?.data?.message || 'Failed to load recent orders');
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    useEffect(() => {
        const fetchRecentProducts = async () => {
            try {
                setProductsLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products`, {
                    withCredentials: true
                });
                const products = data.product || data.products || [];
                const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentProducts(sorted.slice(0, 5));
                setProductsError('');
            } catch (err) {
                setProductsError(err.response?.data?.message || 'Failed to load recent products');
            } finally {
                setProductsLoading(false);
            }
        };

        fetchRecentProducts();
    }, []);

    const getStatusConfig = (status) => {
        const configs = {
            'Delivered': { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
            'Processing': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: RefreshCw },
            'Shipped': { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Package },
            'Pending': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
            'Cancelled': { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle }
        };
        return configs[status] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Clock };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative p-8 space-y-8">
                {/* Header */}
                <div className="animate-fadeIn">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                                        Welcome back, {user?.name || 'Admin'}! 👋
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-lg">
                                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg ml-16">
                                Here's what's happening with your store today
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200">
                                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                Download Report
                            </button>
                            <Link 
                                to="/admin/dashboard/products/new"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Product
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn animation-delay-200">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={stat.title}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-2 cursor-pointer"
                                style={{ 
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="text-white w-6 h-6" />
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                                        stat.positive 
                                            ? 'bg-green-50 text-green-700 border border-green-200' 
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {stat.positive ? (
                                            <TrendingUp className="w-3.5 h-3.5" />
                                        ) : (
                                            <TrendingDown className="w-3.5 h-3.5" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">{stat.title}</h3>
                                    <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">{stat.value}</p>
                                    <Link 
                                        to={stat.link} 
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:translate-x-1 transition-all duration-300"
                                    >
                                        <span>{stat.linkText}</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Overview */}
                    <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 animate-fadeIn animation-delay-400">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Sales Overview</h2>
                            </div>
                            <select className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                            </select>
                        </div>
                        {ordersLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">Loading sales data...</p>
                                </div>
                            </div>
                        ) : ordersError ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                    <p className="text-sm text-red-600">{ordersError}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Date
                                                </div>
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Orders
                                                </div>
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    Total Sales
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(() => {
                                            const today = new Date();
                                            const days = 7;
                                            const rows = [];

                                            for (let i = days - 1; i >= 0; i -= 1) {
                                                const date = new Date(today);
                                                date.setDate(today.getDate() - i);
                                                const dateKey = date.toISOString().slice(0, 10);

                                                const dayOrders = allOrders.filter(order => {
                                                    const orderDate = new Date(order.createdAt).toISOString().slice(0, 10);
                                                    return orderDate === dateKey;
                                                });

                                                const totalSales = dayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

                                                rows.push(
                                                    <tr key={dateKey} className="hover:bg-blue-50/50 transition-colors group">
                                                        <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                                                            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm border border-blue-200">
                                                                {dayOrders.length}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center gap-1 font-bold text-gray-900 text-base">
                                                                ₹{totalSales.toLocaleString()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return rows;
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Top Products */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 animate-fadeIn animation-delay-600">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Top Products</h2>
                        </div>
                        <div className="space-y-4">
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">Loading products...</p>
                                    </div>
                                </div>
                            ) : productsError ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <p className="text-xs text-red-600">{productsError}</p>
                                    </div>
                                </div>
                            ) : recentProducts.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No products yet</p>
                                    </div>
                                </div>
                            ) : (
                                recentProducts.map((product, i) => (
                                    <div 
                                        key={product._id} 
                                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${
                                                i === 0 ? 'from-yellow-400 to-orange-500' :
                                                i === 1 ? 'from-gray-400 to-gray-500' :
                                                i === 2 ? 'from-orange-400 to-amber-500' :
                                                'from-purple-400 to-pink-500'
                                            } rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                {i + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-green-600">₹{product.price}</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-500">Stock: {product.Stock}</span>
                                            </div>
                                        </div>
                                        <Activity className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden animate-fadeIn animation-delay-800">
                    <div className="p-8 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ordersLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">Loading recent orders...</p>
                                        </td>
                                    </tr>
                                ) : ordersError ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                            <p className="text-sm text-red-600">{ordersError}</p>
                                        </td>
                                    </tr>
                                ) : recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">No recent orders</p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order, index) => {
                                        const firstItem = order.orderItems?.[0];
                                        const extraCount = Math.max((order.orderItems?.length || 0) - 1, 0);
                                        const productLabel = firstItem
                                            ? `${firstItem.name}${extraCount ? ` +${extraCount} more` : ''}`
                                            : 'N/A';
                                        const statusConfig = getStatusConfig(order.orderStatus);
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <tr
                                                key={order._id}
                                                className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer"
                                                style={{ 
                                                    animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`,
                                                }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-blue-600 font-mono">
                                                        #{order._id?.slice(-8).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {order.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {order.user?.name || 'Customer'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700 max-w-xs truncate block">
                                                        {productLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span className="font-bold text-green-900">₹{order.totalPrice}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${statusConfig.color}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link
                                                        to={`/admin/dashboard/orders/${order._id}`}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:underline"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {recentOrders.length > 0 && (
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                            <Link
                                to="/admin/dashboard/orders"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                            >
                                View all orders
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animations */}
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

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(40px, -60px) scale(1.15);
                    }
                    66% {
                        transform: translate(-30px, 30px) scale(0.9);
                    }
                }

                .animate-blob {
                    animation: blob 8s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }

                .animation-delay-200 {
                    opacity: 0;
                    animation: fadeIn 0.6s ease-out 0.2s forwards;
                }

                .animation-delay-400 {
                    opacity: 0;
                    animation: fadeIn 0.6s ease-out 0.4s forwards;
                }

                .animation-delay-600 {
                    opacity: 0;
                    animation: fadeIn 0.6s ease-out 0.6s forwards;
                }

                .animation-delay-800 {
                    opacity: 0;
                    animation: fadeIn 0.6s ease-out 0.8s forwards;
                }
            `}</style>
        </div>
    );
};

export default DashboardHome;
