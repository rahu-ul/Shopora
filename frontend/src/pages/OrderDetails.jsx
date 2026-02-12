import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderDetails,
  clearErrors,
  clearSelectedOrder,
  cancelOrder,
  requestReturn,
  applySocketOrderUpdate,
} from "../redux/slices/orderSlice";
import { createSocketConnection } from "../socket";
import Loading from "../component/common/Loading";
import {
  ArrowLeft,
  Calendar,
  ReceiptText,
  Truck,
  MapPin,
  Phone,
  Package,
  Download,
  AlertCircle,
  Clock3,
  CreditCard,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  ShoppingBag,
  FileText,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const timelineSteps = [
  { key: "pending", label: "Pending", icon: Clock3 },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Package },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const mapStatusToStep = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return "cancelled";
  if (normalized.includes("return")) return "returned";
  if (normalized === "pending") return "pending";
  if (normalized === "confirmed" || normalized === "processing") return "confirmed";
  if (normalized === "shipped") return "shipped";
  if (normalized.includes("out")) return "out_for_delivery";
  if (normalized === "delivered") return "delivered";
  return "pending";
};

const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const derivePaymentMethod = (order) => {
  const id = order?.paymentInfo?.id?.toLowerCase() || "";
  if (id.includes("upi")) return "UPI";
  if (id) return "Card";
  return "COD";
};

const derivePaymentStatus = (order) => {
  const status = order?.paymentStatus || order?.paymentInfo?.status || "Pending";
  if (typeof status !== "string") return "Pending";
  if (status.toLowerCase() === "succeeded") return "Paid";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getVisibleActions = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return ["reorder"];
  if (normalized.includes("return")) return ["reorder"];
  if (normalized === "delivered") return ["return", "rate", "invoice"];
  return ["cancel", "track"];
};

const canInitiateReturn = (order) => {
  if (!order) return false;
  const orderStatus = String(order.orderStatus || "").toLowerCase();
  const paymentStatus = String(order.paymentStatus || order.paymentInfo?.status || "").toLowerCase();
  if (orderStatus === "pending") return false;
  if (paymentStatus === "refunded") return false;
  if (order.returnRequest?.requested) return false;
  if (orderStatus !== "delivered") return false;
  if (!order.deliveredAt) return false;

  const returnWindowDays = 7;
  const deliveredAtMs = new Date(order.deliveredAt).getTime();
  const expiresAt = deliveredAtMs + returnWindowDays * 24 * 60 * 60 * 1000;
  return Date.now() <= expiresAt;
};

const buildHistory = (order) => {
  const logs = [
    { label: "Order placed", at: order.createdAt },
    { label: "Payment successful", at: order.paymentInfo?.status === "succeeded" ? order.createdAt : null },
    { label: "Order shipped", at: ["shipped", "out for delivery", "delivered"].includes(order.orderStatus?.toLowerCase()) ? order.createdAt : null },
    { label: "Delivered", at: order.deliveredAt || null },
    { label: order.returnRequest?.reason ? `Return requested: ${order.returnRequest.reason}` : "Return requested", at: order.returnRequest?.requestedAt || null },
  ];
  return logs.filter((entry) => entry.at);
};

const downloadInvoice = (order) => {
  const invoiceNo = `INV-${order._id?.slice(-8).toUpperCase()}`;
  const rows = (order.orderItems || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">${formatCurrency(item.price)}</td>
        <td style="padding:8px;border:1px solid #ddd;">${formatCurrency((item.price || 0) * (item.quantity || 0))}</td>
      </tr>`
    )
    .join("");

  const popup = window.open("", "_blank");
  if (!popup) return;

  popup.document.write(`
    <html>
      <head><title>${invoiceNo}</title></head>
      <body style="font-family:Arial,sans-serif;padding:24px;">
        <h2>Invoice ${invoiceNo}</h2>
        <p>Order ID: ${order._id}</p>
        <p>Date: ${formatDateTime(order.createdAt)}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
              <th style="padding:8px;border:1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <h3 style="margin-top:20px;">Total: ${formatCurrency(order.totalPrice)}</h3>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
};

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder, detailsLoading, actionLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;

    const socket = createSocketConnection();

    const handleConnect = () => {
      socket.emit("join_order", id);
    };

    const handleOrderUpdated = (payload) => {
      if (!payload?.order?._id) return;
      if (payload.order._id !== id) return;
      dispatch(applySocketOrderUpdate(payload.order));
    };

    socket.on("connect", handleConnect);
    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:updated", handleOrderUpdated);
      socket.disconnect();
    };
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedOrder());
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const order = selectedOrder;
  const currentStep = mapStatusToStep(order?.orderStatus);
  const activeIndex = timelineSteps.findIndex((step) => step.key === currentStep);
  const actions = getVisibleActions(order?.orderStatus);

  const itemTotal = useMemo(() => {
    if (!order) return 0;
    if (typeof order.itemsPrice === "number") return order.itemsPrice;
    return (order.orderItems || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [order]);

  const tax = Number(order?.taxPrice || 0);
  const shipping = Number(order?.shippingPrice || 0);
  const total = Number(order?.totalPrice || itemTotal + tax + shipping);
  const discount = Math.max(itemTotal + tax + shipping - total, 0);
  const paymentStatus = derivePaymentStatus(order);
  const paymentMethod = derivePaymentMethod(order);
  const history = order ? buildHistory(order) : [];
  const isReturnAllowed = canInitiateReturn(order);

  const handleReturnRequest = () => {
    if (!order?._id) return;
    if (!isReturnAllowed) return;

    const reason = window.prompt("Please enter your return reason:");
    if (reason === null) return;
    if (!reason.trim()) {
      window.alert("Return reason is required.");
      return;
    }

    dispatch(requestReturn({ orderId: order._id, reason: reason.trim() }));
  };

  if (detailsLoading && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border-2 border-red-100 p-10 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Unable to Load Order
          </h2>
          <p className="text-gray-600 mb-8 text-lg">{error || "Invalid order ID or unauthorized access."}</p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const invoiceNumber = `INV-${order._id?.slice(-8).toUpperCase()}`;
  const shippingInfo = order.shippingInfo || {};
  const tracking = order.tracking || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm bg-white/90">
          <Link 
            to="/orders" 
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold group transition-all duration-300"
          >
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to My Orders</span>
          </Link>
          
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <ShoppingBag className="w-4 h-4" />
            <span>Dashboard</span>
            <span>›</span>
            <span>My Orders</span>
            <span>›</span>
            <span className="font-semibold text-gray-700">Order #{order._id?.slice(-8).toUpperCase()}</span>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-mono font-bold shadow-lg">
              #{order._id?.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500">Order ID</p>
            </div>
            <p className="font-bold text-gray-900 text-lg font-mono truncate">{order._id}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
            </div>
            <p className="font-bold text-gray-900">{formatDateTime(order.createdAt)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
            </div>
            <p className="font-bold text-green-600 text-2xl">{formatCurrency(total)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500">Payment</p>
            </div>
            <p className="font-bold text-gray-900">{paymentMethod}</p>
            <p className={`text-sm mt-1 font-semibold ${paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
              {paymentStatus}
            </p>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Order Status Timeline</h2>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ zIndex: 0 }}>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${activeIndex >= 0 ? ((activeIndex + 1) / timelineSteps.length) * 100 : 0}%` }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative" style={{ zIndex: 1 }}>
              {timelineSteps.map((step, index) => {
                const isDone = activeIndex >= 0 && index <= activeIndex;
                const isCurrent = timelineSteps[activeIndex]?.key === step.key;
                const Icon = step.icon;
                
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 shadow-lg ${
                        isCurrent
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 scale-110 shadow-blue-300"
                          : isDone
                          ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-300"
                          : "bg-gray-100 shadow-gray-200"
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${isCurrent || isDone ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div className={`text-center px-3 py-2 rounded-xl ${
                      isCurrent ? "bg-blue-50 border-2 border-blue-200" : ""
                    }`}>
                      <p className={`text-sm font-bold ${
                        isCurrent ? "text-blue-700" : isDone ? "text-green-700" : "text-gray-500"
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {(currentStep === "cancelled" || currentStep === "returned") && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-50 text-red-700 border-2 border-red-200 font-semibold shadow-sm">
              <XCircle className="w-5 h-5" />
              Current Status: {order.orderStatus}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Product(s) Details</h2>
          </div>
          
          <div className="space-y-4">
            {(order.orderItems || []).map((item, idx) => (
              <div 
                key={`${item.product}-${idx}`} 
                className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shadow-md group-hover:shadow-xl transition-shadow" 
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">{item.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Price per item</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency((item.price || 0) * (item.quantity || 0))}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Address Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <ReceiptText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Price Breakdown</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Item total</span>
                <span className="font-bold text-gray-900">{formatCurrency(itemTotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-green-700 font-medium">Discount</span>
                  <span className="font-bold text-green-600">- {formatCurrency(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Tax (GST)</span>
                <span className="font-bold text-gray-900">{formatCurrency(tax)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Shipping charges</span>
                <span className="font-bold text-gray-900">{formatCurrency(shipping)}</span>
              </div>
              
              <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                <span className="text-lg font-bold">Final Payable</span>
                <span className="text-2xl font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {(order.user?.name || "R")[0].toUpperCase()}
                </div>
                <p className="font-bold text-gray-900 text-lg">{order.user?.name || "Receiver"}</p>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Pincode: <span className="font-bold">{shippingInfo.pinCode || "N/A"}</span></span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-semibold">{shippingInfo.phoneNo || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Invoice Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Shipping & Courier Info</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <Truck className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Courier Partner</p>
                  <p className="font-bold text-gray-900">{tracking.courier || "Not assigned yet"}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Tracking ID</p>
                <p className="font-mono font-bold text-gray-900">{tracking.trackingId || "N/A"}</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-700 mb-1">Estimated Delivery</p>
                <p className="font-bold text-purple-900">
                  {order.deliveredAt ? formatDateTime(order.deliveredAt) : "Will be updated soon"}
                </p>
              </div>
              
              {tracking.trackingId && (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${tracking.courier || "courier"} tracking ${tracking.trackingId}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Package className="w-5 h-5" />
                  Track Package
                </a>
              )}
            </div>
          </div>

          {/* Invoice */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <p className="text-sm text-purple-700 mb-2">Invoice Number</p>
                <p className="font-mono font-bold text-2xl text-purple-900">{invoiceNumber}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Billing Address</p>
                <p className="text-gray-700">
                  {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}
                </p>
              </div>
              
              <button
                onClick={() => downloadInvoice(order)}
                className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Available Actions</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {actions.includes("cancel") && (
              <button
                onClick={() => dispatch(cancelOrder(order._id))}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <XCircle className="w-5 h-5" />
                {actionLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            
            {actions.includes("track") && (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`${tracking.courier || "courier"} tracking ${tracking.trackingId || ""}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Package className="w-5 h-5" />
                Track Order
              </a>
            )}
            
            {actions.includes("return") && (
              <button
                onClick={handleReturnRequest}
                disabled={actionLoading || !isReturnAllowed}
                title={!isReturnAllowed ? "Return is not eligible for this order" : ""}
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-900 font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" />
                {actionLoading ? "Submitting Return..." : "Return"}
              </button>
            )}
            
            {actions.includes("rate") && (
              <button className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white border-2 border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 text-gray-900 font-bold shadow-md hover:shadow-lg transition-all duration-300">
                <Star className="w-5 h-5" />
                Rate
              </button>
            )}
            
            {actions.includes("invoice") && (
              <button 
                onClick={() => downloadInvoice(order)} 
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
            )}
            
            {actions.includes("reorder") && (
              <Link 
                to="/product" 
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Reorder
              </Link>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl shadow-lg">
              <ReceiptText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Order Notes / History</h2>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Clock3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No timeline notes yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((note, idx) => (
                <div 
                  key={`${note.label}-${idx}`} 
                  className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-gray-800">{note.label}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(note.at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default OrderDetails;
