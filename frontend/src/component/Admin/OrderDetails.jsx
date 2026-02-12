// src/components/Admin/OrderDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { createSocketConnection } from '../../socket';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/order/${id}`, {
                    withCredentials: true
                });
                setOrder(data.order || null);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const socket = createSocketConnection();

        const handleConnect = () => {
            socket.emit('join_order', id);
        };

        const handleOrderUpdated = (payload) => {
            const incomingOrder = payload?.order;
            if (!incomingOrder?._id) return;
            if (incomingOrder._id !== id) return;
            setOrder(incomingOrder);
        };

        socket.on('connect', handleConnect);
        socket.on('order:updated', handleOrderUpdated);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('order:updated', handleOrderUpdated);
            socket.disconnect();
        };
    }, [id]);

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!order) {
        return <div className="p-6 text-center text-gray-500">Order not found</div>;
    }

    const orderDate = order.createdAt ? new Date(order.createdAt) : null;
    const orderIdShort = order._id?.slice(-6);
    const shipping = order.shippingInfo || {};
    const billing = order.billingInfo || order.shippingInfo || {};
    const paymentStatus = order.paymentInfo?.status || 'Pending';
    const paymentMethod = order.paymentInfo?.id ? 'Card' : 'COD';
    const transactionId = order.paymentInfo?.id || 'N/A';
    const itemsSubtotal = typeof order.itemsPrice === 'number'
        ? order.itemsPrice
        : (order.orderItems || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const tax = order.taxPrice || 0;
    const shippingCharge = order.shippingPrice || 0;
    const discount = order.discount || 0;
    const finalTotal = order.totalPrice || itemsSubtotal + tax + shippingCharge - discount;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <Link
                    to="/admin/dashboard/orders"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    Back to Orders
                </Link>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div><span className="font-semibold">Order ID:</span> #{orderIdShort}</div>
                    <div><span className="font-semibold">Order Date:</span> {orderDate ? orderDate.toLocaleString() : 'N/A'}</div>
                    <div><span className="font-semibold">Status:</span> {order.orderStatus || 'Pending'}</div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div>
                        <p><span className="font-semibold">Name:</span> {order.user?.name || 'N/A'}</p>
                        <p><span className="font-semibold">Email:</span> {order.user?.email || 'N/A'}</p>
                        <p><span className="font-semibold">Phone:</span> {shipping.phoneNo || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Shipping Address:</p>
                        <p>{shipping.address || 'N/A'}</p>
                        <p>{shipping.city || ''} {shipping.state || ''} {shipping.pinCode || ''}</p>
                        <p>{shipping.country || ''}</p>
                        <p className="font-semibold mt-3">Billing Address:</p>
                        <p>{billing.address || 'Same as shipping'}</p>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                                <th className="py-3 px-4">Product</th>
                                <th className="py-3 px-4 text-center">Quantity</th>
                                <th className="py-3 px-4 text-center">Price</th>
                                <th className="py-3 px-4 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {(order.orderItems || []).map((item, idx) => (
                                <tr key={`${item.product}-${idx}`} className="border-b border-gray-200">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/50'}
                                                alt={item.name}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                                    <td className="py-3 px-4 text-center">Rs {item.price}</td>
                                    <td className="py-3 px-4 text-center">Rs {(item.price || 0) * (item.quantity || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div><span className="font-semibold">Payment Method:</span> {paymentMethod}</div>
                    <div><span className="font-semibold">Payment Status:</span> {paymentStatus}</div>
                    <div><span className="font-semibold">Transaction ID:</span> {transactionId}</div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between"><span>Subtotal</span><span>Rs {itemsSubtotal}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>Rs {tax}</span></div>
                    <div className="flex justify-between"><span>Shipping Charge</span><span>Rs {shippingCharge}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span>Rs {discount}</span></div>
                    <div className="flex justify-between font-semibold border-t pt-2"><span>Final Total</span><span>Rs {finalTotal}</span></div>
                </div>
            </div>

            {/* Tracking Info */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Tracking Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><span className="font-semibold">Courier:</span> {order.tracking?.courier || 'N/A'}</div>
                    <div><span className="font-semibold">Tracking ID:</span> {order.tracking?.trackingId || 'N/A'}</div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
