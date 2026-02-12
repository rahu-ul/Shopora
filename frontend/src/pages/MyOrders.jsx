// src/pages/MyOrders.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders, applySocketOrderUpdate } from "../redux/slices/orderSlice";
import { createSocketConnection } from "../socket";
import Loading from "../component/common/Loading";
import { Package, Calendar, ShoppingBag, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const shownReturnReasonToastsRef = useRef(new Set());
  const [expandedRefundOrderId, setExpandedRefundOrderId] = useState("");

  const maybeToastReturnReason = (order) => {
    const orderStatus = String(order?.orderStatus || "").trim().toLowerCase();
    const hasReturnFlow =
      orderStatus === "return requested" ||
      orderStatus === "returned" ||
      orderStatus === "refunded" ||
      Boolean(order?.returnRequest?.requested);
    const reason = String(order?.returnRequest?.reason || "").trim();
    if (!hasReturnFlow || !reason) return;

    const dedupeKey = `${order._id}:${order.orderStatus}:${reason}`;
    if (shownReturnReasonToastsRef.current.has(dedupeKey)) return;

    toast.info(`Return reason for order #${order._id?.slice(-6)}: ${reason}`);
    shownReturnReasonToastsRef.current.add(dedupeKey);
  };

  const normalizedOrders = useMemo(() => {
    return (orders || []).map((order) => {
      const orderStatus = String(order?.orderStatus || "").trim().toLowerCase();
      const paymentStatus = String(order?.paymentStatus || order?.paymentInfo?.status || "")
        .trim()
        .toLowerCase();

      const hasReturnFlow =
        orderStatus === "return requested" ||
        orderStatus === "returned" ||
        orderStatus === "refunded" ||
        Boolean(order?.returnRequest?.requested);
      const isReturnApproved =
        Boolean(order?.returnRequest?.requested) &&
        (orderStatus === "returned" || orderStatus === "refunded" || paymentStatus === "refunded");

      return {
        ...order,
        _normalized: {
          orderStatus,
          paymentStatus,
          hasReturnFlow,
          isReturnApproved,
          expectedRefundAt: order?.returnRequest?.requestedAt
            ? new Date(
                new Date(order.returnRequest.requestedAt).getTime() + 5 * 24 * 60 * 60 * 1000
              ).toISOString()
            : null,
          refundProcessedAt:
            order?.refundedAt ||
            order?.refund?.refundedAt ||
            order?.returnRequest?.approvedAt ||
            order?.updatedAt ||
            null,
        },
      };
    });
  }, [orders]);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
    const socket = createSocketConnection();

    const handleOrderUpdated = (payload) => {
      if (!payload?.order?._id) return;
      maybeToastReturnReason(payload.order);
      dispatch(applySocketOrderUpdate(payload.order));
    };

    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:updated", handleOrderUpdated);
      socket.disconnect();
    };
  }, [dispatch]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      confirmed: "bg-cyan-100 text-cyan-800 border-cyan-200",
      packed: "bg-indigo-100 text-indigo-800 border-indigo-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      "out for delivery": "bg-violet-100 text-violet-800 border-violet-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      "return requested": "bg-orange-100 text-orange-800 border-orange-200",
      returned: "bg-amber-100 text-amber-800 border-amber-200",
      refunded: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDateTime = (value) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 ml-16">Track and manage all your orders in one place</p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Orders</h3>
            <p className="text-red-700">{error}</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {normalizedOrders.map((order, index) => (
              <div
                key={order._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="p-6 sm:p-8">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
                        <p className="text-lg font-bold text-gray-900 font-mono tracking-tight">
                          {order._id}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                        order.orderStatus
                      )} transition-all duration-200 shadow-sm`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    {/* Items Count */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Items</p>
                        <p className="text-2xl font-bold text-blue-900">{order.orderItems.length}</p>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <span className="text-2xl">₹</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Total Price</p>
                        <p className="text-2xl font-bold text-green-900">₹{order.totalPrice}</p>
                      </div>
                    </div>

                    {/* Order Date */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Placed on</p>
                        <p className="text-lg font-bold text-purple-900">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {order._normalized?.hasReturnFlow && (
                    <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50">
                      <p className="text-sm font-semibold text-orange-900">Return Details</p>
                      <p className="mt-1 text-sm text-orange-800">
                        Reason: {order.returnRequest?.reason || "Not provided"}
                      </p>
                    </div>
                  )}

                  {order._normalized?.isReturnApproved && (
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRefundOrderId((prev) => (prev === order._id ? "" : order._id))
                        }
                        className="w-full text-left p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <p className="text-sm font-semibold text-emerald-900">Refund Section</p>
                        <p className="mt-1 text-sm text-emerald-800">
                          {order._normalized?.paymentStatus === "refunded"
                            ? "Refund has been issued by admin. Click to view full refund details."
                            : "Return approved by admin. Click to view refund details."}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-emerald-900">
                          Refund Amount: Rs. {Number(order.totalPrice || 0).toFixed(2)}
                        </p>
                      </button>

                      {expandedRefundOrderId === order._id && (
                        <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-4">
                          <h4 className="text-sm font-bold text-emerald-900 mb-3">Refund Details</h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>
                              <span className="font-semibold text-gray-900">Order ID:</span> {order._id}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Current Status:</span>{" "}
                              {order.orderStatus || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Return Reason:</span>{" "}
                              {order.returnRequest?.reason || "Not provided"}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Return Request Date:</span>{" "}
                              {formatDateTime(order.returnRequest?.requestedAt)}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Refund Date:</span>{" "}
                              {formatDateTime(
                                order._normalized?.refundProcessedAt || order._normalized?.expectedRefundAt
                              )}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Payment Status:</span>{" "}
                              {order.paymentStatus || order.paymentInfo?.status || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Refund Amount:</span> Rs.{" "}
                              {Number(order.totalPrice || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Details Button */}
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl group"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You have not placed any orders yet. Start shopping to see your orders here!
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Shopping</span>
            </a>
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
      `}</style>
    </div>
  );
};

export default MyOrders;
