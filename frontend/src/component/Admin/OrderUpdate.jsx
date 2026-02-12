// src/components/Admin/OrderUpdate.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ORDER_STATUSES = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded'
];

const PAYMENT_STATUSES = ['Pending', 'Paid', 'Refunded'];

const OrderUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);

    const [orderStatus, setOrderStatus] = useState('Pending');
    const [courier, setCourier] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [delayReason, setDelayReason] = useState('');
    const [adminComments, setAdminComments] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/order/${id}`, {
                    withCredentials: true
                });
                const o = data.order || null;
                setOrder(o);
                setOrderStatus(o?.orderStatus || 'Pending');
                setCourier(o?.tracking?.courier || '');
                setTrackingId(o?.tracking?.trackingId || '');
                setPaymentStatus(o?.paymentStatus || o?.paymentInfo?.status || 'Pending');
                setDelayReason(o?.deliveryNotes?.delayReason || '');
                setAdminComments(o?.deliveryNotes?.adminComments || '');
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                orderStatus,
                tracking: {
                    courier,
                    trackingId
                },
                paymentStatus,
                deliveryNotes: {
                    delayReason,
                    adminComments
                }
            };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/order/${id}`, payload, {
                withCredentials: true
            });
            toast.success('Order updated');
            navigate(`/admin/dashboard/orders/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update order');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!order) {
        return <div className="p-6 text-center text-gray-500">Order not found</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Update Order</h1>
                <Link to={`/admin/dashboard/orders/${id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                    Back to Order
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                    <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full md:w-1/2 border border-slate-200 rounded-lg px-3 py-2"
                    >
                        {ORDER_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Tracking Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Courier name"
                            value={courier}
                            onChange={(e) => setCourier(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Tracking number"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
                    <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-full md:w-1/2 border border-slate-200 rounded-lg px-3 py-2"
                    >
                        {PAYMENT_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Delivery Notes</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            placeholder="Delay reason"
                            value={delayReason}
                            onChange={(e) => setDelayReason(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2"
                        />
                        <textarea
                            rows="3"
                            placeholder="Admin comments (internal)"
                            value={adminComments}
                            onChange={(e) => setAdminComments(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Update Order'}
                    </button>
                    <Link
                        to="/admin/dashboard/orders"
                        className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default OrderUpdate;
