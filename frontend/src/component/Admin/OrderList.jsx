// src/components/Admin/OrderList.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { createSocketConnection } from '../../socket';
import {
    Package,
    Eye,
    Save,
    ChevronRight,
    AlertCircle,
    Calendar,
    DollarSign,
    User,
    Mail,
    Filter,
    Search,
    RefreshCw,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    RotateCcw,
    Box,
    Sparkles,
    TrendingUp,
    ShoppingBag,
    ArrowUpRight
} from 'lucide-react';

const ORDER_STATUSES = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Return Requested',
    'Returned',
    'Refunded',
    'Cancelled'
];

const sortByRecent = (incomingOrders = []) =>
    [...incomingOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusDrafts, setStatusDrafts] = useState({});
    const [updatingOrderId, setUpdatingOrderId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const socket = createSocketConnection();

        const handleOrderUpdated = (payload) => {
            const incomingOrder = payload?.order;
            if (!incomingOrder?._id) return;

            setOrders((prev) => {
                const existingOrderIndex = prev.findIndex((order) => order._id === incomingOrder._id);
                if (existingOrderIndex === -1) {
                    return sortByRecent([incomingOrder, ...prev]);
                }

                const nextOrders = prev.map((order) =>
                    order._id === incomingOrder._id ? { ...order, ...incomingOrder } : order
                );
                return sortByRecent(nextOrders);
            });

            setStatusDrafts((prev) => ({
                ...prev,
                [incomingOrder._id]: incomingOrder.orderStatus || prev[incomingOrder._id] || 'Pending',
            }));
        };

        socket.on('order:updated', handleOrderUpdated);

        return () => {
            socket.off('order:updated', handleOrderUpdated);
            socket.disconnect();
        };
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/orders`, {
                withCredentials: true
            });
            const incomingOrders = data.orders || [];
            setOrders(sortByRecent(incomingOrders));
            setStatusDrafts(
                incomingOrders.reduce((acc, order) => {
                    acc[order._id] = order.orderStatus || 'Pending';
                    return acc;
                }, {})
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (orderId, nextStatus) => {
        setStatusDrafts((prev) => ({
            ...prev,
            [orderId]: nextStatus,
        }));
    };

    const handleInlineStatusUpdate = async (orderId) => {
        const nextStatus = statusDrafts[orderId];
        if (!nextStatus) return;

        try {
            setUpdatingOrderId(orderId);
            setError('');

            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/order/${orderId}`,
                { orderStatus: nextStatus },
                { withCredentials: true }
            );

            if (data?.order?._id) {
                setOrders((prev) => {
                    const nextOrders = prev.map((order) =>
                        order._id === data.order._id ? { ...order, ...data.order } : order
                    );
                    return sortByRecent(nextOrders);
                });
                setStatusDrafts((prev) => ({
                    ...prev,
                    [data.order._id]: data.order.orderStatus || nextStatus,
                }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdatingOrderId('');
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'Pending': { 
                color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                icon: Clock,
                gradient: 'from-yellow-400 to-amber-500'
            },
            'Confirmed': { 
                color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                icon: CheckCircle,
                gradient: 'from-cyan-400 to-teal-500'
            },
            'Processing': { 
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: RefreshCw,
                gradient: 'from-blue-400 to-indigo-500'
            },
            'Packed': { 
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                icon: Box,
                gradient: 'from-indigo-400 to-purple-500'
            },
            'Shipped': { 
                color: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: Truck,
                gradient: 'from-purple-400 to-violet-500'
            },
            'Out for Delivery': { 
                color: 'bg-violet-50 text-violet-700 border-violet-200',
                icon: Truck,
                gradient: 'from-violet-400 to-fuchsia-500'
            },
            'Delivered': { 
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: CheckCircle,
                gradient: 'from-green-400 to-emerald-500'
            },
            'Return Requested': { 
                color: 'bg-orange-50 text-orange-700 border-orange-200',
                icon: RotateCcw,
                gradient: 'from-orange-400 to-amber-500'
            },
            'Returned': { 
                color: 'bg-amber-50 text-amber-700 border-amber-200',
                icon: Package,
                gradient: 'from-amber-400 to-yellow-500'
            },
            'Refunded': { 
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: DollarSign,
                gradient: 'from-emerald-400 to-green-500'
            },
            'Cancelled': { 
                color: 'bg-red-50 text-red-700 border-red-200',
                icon: XCircle,
                gradient: 'from-red-400 to-rose-500'
            },
        };
        return configs[status] || { 
            color: 'bg-gray-50 text-gray-700 border-gray-200',
            icon: Package,
            gradient: 'from-gray-400 to-gray-500'
        };
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'All' || order.orderStatus === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === 'Pending').length,
        delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
        revenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative p-8">
                {/* Header Section */}
                <div className="mb-8 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                                    <ShoppingBag className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                                    Order Management
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">Manage and track all customer orders</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={fetchOrders}
                            className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Orders</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-yellow-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Pending</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.pending}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <Sparkles className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Delivered</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.delivered}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-3xl font-extrabold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer Name, or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-12 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer min-w-[200px]"
                            >
                                <option value="All">All Statuses</option>
                                {ORDER_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 animate-spin">
                                <RefreshCw className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-gray-600 font-medium">Loading orders...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <AlertCircle className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">Error Loading Orders</h3>
                                        <p className="text-red-100">{error}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <button 
                                    onClick={fetchOrders}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                        <th className="py-5 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="py-5 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length > 0 ? filteredOrders.map((order, index) => {
                                        const statusConfig = getStatusConfig(order.orderStatus);
                                        const StatusIcon = statusConfig.icon;
                                        const hasStatusChange = (statusDrafts[order._id] || order.orderStatus) !== order.orderStatus;
                                        
                                        return (
                                            <tr 
                                                key={order._id} 
                                                className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300 group"
                                                style={{
                                                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                                                }}
                                            >
                                                {/* Order Details */}
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 bg-gradient-to-br ${statusConfig.gradient} rounded-lg`}>
                                                            <Package className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 font-mono">
                                                                #{order._id?.slice(-8).toUpperCase()}
                                                            </p>
                                                            <p className="text-xs text-gray-500 font-mono">{order._id}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="py-5 px-6">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg">
                                                            <User className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{order.user?.name}</p>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                                <Mail className="w-3 h-3" />
                                                                {order.user?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Amount */}
                                                <td className="py-5 px-6 text-center">
                                                    <div className="inline-flex items-center gap-1 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span className="font-bold text-green-900">₹{order.totalPrice.toLocaleString()}</span>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-5 px-6 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 ${statusConfig.color}`}>
                                                            <StatusIcon className="w-4 h-4" />
                                                            {order.orderStatus}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="py-5 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col items-center gap-3">
                                                        {/* View Button */}
                                                        <Link
                                                            to={`/admin/dashboard/orders/${order._id}`}
                                                            className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Details
                                                        </Link>

                                                        {/* Status Update */}
                                                        <div className="flex items-center gap-2 w-full">
                                                            <select
                                                                value={statusDrafts[order._id] || order.orderStatus || 'Pending'}
                                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                                className="flex-1 text-xs border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer bg-white"
                                                            >
                                                                {ORDER_STATUSES.map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleInlineStatusUpdate(order._id)}
                                                                disabled={
                                                                    updatingOrderId === order._id || !hasStatusChange
                                                                }
                                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs ${
                                                                    hasStatusChange
                                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                } disabled:opacity-60`}
                                                            >
                                                                {updatingOrderId === order._id ? (
                                                                    <>
                                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                                        Saving...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Save className="w-4 h-4" />
                                                                        Save
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Full Update Link */}
                                                        <Link
                                                            to={`/admin/dashboard/orders/${order._id}/update`}
                                                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                                                        >
                                                            Full Update
                                                            <ChevronRight className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="6" className="py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-6 bg-gray-100 rounded-full mb-4">
                                                        <Package className="w-16 h-16 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                                                    <p className="text-gray-500">
                                                        {searchTerm || filterStatus !== 'All' 
                                                            ? 'Try adjusting your search or filter criteria'
                                                            : 'No orders have been placed yet'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        {filteredOrders.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{orders.length}</span> orders
                                </p>
                            </div>
                        )}
                    </div>
                )}
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
            `}</style>
        </div>
    );
};

export default OrderList;
