const Order = require('../models/orderModel'); // ✅ Capitalized model name
const Product = require('../models/productModel');
const Errorhandler = require('../Utils/Errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { getIO } = require('../socket');
const sendEmail = require('../Utils/sendEmail');

const RETURN_WINDOW_DAYS = Number(process.env.RETURN_WINDOW_DAYS || 7);

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const derivedPaymentStatus = normalizePaymentStatus(
    req.body.paymentStatus || paymentInfo?.status
  );

  const order = await Order.create({ // ✅ Using the model here
    shippingInfo,
    orderItems,
    paymentInfo,
    paymentStatus: derivedPaymentStatus,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  });

  await maybeReduceStock(order);
  await order.save({ validateBeforeSave: false });
  await emitOrderUpdated(order._id);

  res.status(201).json({
    success: true,
    order
  });
});


// creatiing get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new Errorhandler("Order not found with this ID", 404));
  }

  const isOwner = order.user?._id?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return next(new Errorhandler("Unauthorized access to this order", 403));
  }

  res.status(200).json({
    success: true,
    order
  });
} );

// get single order (Admin)
exports.getAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new Errorhandler("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});




// logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders || orders.length === 0) {
    return next(new Errorhandler("No orders found for this user", 404));
  }

  res.status(200).json({
    success: true,
    orders
  });
});

// cancel own order (User)
exports.cancelMyOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this ID", 404));
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return next(new Errorhandler("Unauthorized access to this order", 403));
  }

  const currentStatus = (order.orderStatus || "").toLowerCase();
  if (["delivered", "cancelled", "returned"].includes(currentStatus)) {
    return next(new Errorhandler("This order can no longer be cancelled", 400));
  }
  if (order.orderLocked || order.returnRequest?.requested) {
    return next(new Errorhandler("This order is locked and cannot be edited", 400));
  }

  order.orderStatus = "Cancelled";
  await order.save({ validateBeforeSave: false });
  await emitOrderUpdated(order._id);

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order
  });
});

// request return (User)
exports.requestReturn = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new Errorhandler("Order not found with this ID", 404));
  }

  if (order.user?._id?.toString() !== req.user._id.toString()) {
    return next(new Errorhandler("Unauthorized access to this order", 403));
  }

  const reason = String(req.body?.reason || "").trim();
  if (!reason) {
    return next(new Errorhandler("Return reason is required", 400));
  }

  const { eligible, message } = validateReturnEligibility(order);
  if (!eligible) {
    return next(new Errorhandler(message, 400));
  }

  order.returnRequest = {
    requested: true,
    reason,
    requestedAt: Date.now(),
  };
  order.orderStatus = "Return Requested";
  order.orderLocked = true;

  await order.save({ validateBeforeSave: false });
  await emitOrderUpdated(order._id);
  await notifyAdminsForReturnRequest(order);

  res.status(200).json({
    success: true,
    message: "Return request submitted successfully",
    order
  });
});


// get All orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email");

  let totalAmount = 0;
  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  if (!orders || orders.length === 0) {
    return next(new Errorhandler("No orders found", 404));
  }

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  });
});

// Update order status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new Errorhandler("You have already delivered this order", 400));
  }

  const nextStatus = req.body.status || req.body.orderStatus;

  if (nextStatus) {
    order.orderStatus = nextStatus;
  }

  if (nextStatus && isReturnTerminalState(nextStatus)) {
    order.orderLocked = true;
  }

  if (nextStatus && nextStatus === "Delivered" && !order.deliveredAt) {
    order.deliveredAt = Date.now();
  }

  if (req.body.tracking) {
    order.tracking = {
      courier: req.body.tracking.courier || order.tracking?.courier,
      trackingId: req.body.tracking.trackingId || order.tracking?.trackingId,
    };
  }

  if (typeof req.body.paymentStatus === "string") {
    order.paymentStatus = normalizePaymentStatus(req.body.paymentStatus);
  }

  if (req.body.deliveryNotes) {
    order.deliveryNotes = {
      delayReason: req.body.deliveryNotes.delayReason || order.deliveryNotes?.delayReason,
      adminComments: req.body.deliveryNotes.adminComments || order.deliveryNotes?.adminComments,
    };
  }

  await maybeReduceStock(order);
  await order.save({ validateBeforeSave: false });
  await emitOrderUpdated(order._id);

  res.status(200).json({
    success: true,
    order
  });
});

function normalizePaymentStatus(status = "") {
  const normalized = String(status).trim().toLowerCase();
  if (normalized === "succeeded" || normalized === "paid") return "Paid";
  if (normalized === "failed") return "Failed";
  if (normalized === "refunded") return "Refunded";
  return status || "Pending";
}

function isReturnTerminalState(status = "") {
  const normalized = String(status).trim().toLowerCase();
  return normalized === "returned" || normalized === "refunded";
}

function validateReturnEligibility(order) {
  const status = String(order?.orderStatus || "").trim().toLowerCase();
  const paymentStatus = String(order?.paymentStatus || order?.paymentInfo?.status || "")
    .trim()
    .toLowerCase();

  if (order?.returnRequest?.requested || status.includes("return")) {
    return { eligible: false, message: "Return request already submitted for this order" };
  }

  if (status === "pending") {
    return { eligible: false, message: "Pending orders cannot be returned" };
  }

  if (paymentStatus === "refunded") {
    return { eligible: false, message: "Refunded orders cannot be returned again" };
  }

  if (status !== "delivered" || !order?.deliveredAt) {
    return { eligible: false, message: "Only delivered orders can be returned" };
  }

  const deliveredAt = new Date(order.deliveredAt).getTime();
  const returnWindowEndsAt = deliveredAt + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() > returnWindowEndsAt) {
    return { eligible: false, message: `Return window of ${RETURN_WINDOW_DAYS} days has expired` };
  }

  if (order?.orderLocked) {
    return { eligible: false, message: "Order is locked and cannot be returned" };
  }

  return { eligible: true };
}

function isPaymentSuccessful(order) {
  const status = String(order?.paymentStatus || order?.paymentInfo?.status || "")
    .trim()
    .toLowerCase();
  return status === "paid" || status === "succeeded";
}

function isOrderConfirmed(status = "") {
  const normalized = String(status).trim().toLowerCase();
  return ["confirmed", "processing", "packed", "shipped", "out for delivery", "delivered"].includes(normalized);
}

async function maybeReduceStock(order) {
  if (!order || order.stockReduced) return;

  const shouldReduce = isPaymentSuccessful(order) || isOrderConfirmed(order.orderStatus);
  if (!shouldReduce) return;

  await Promise.all(
    (order.orderItems || []).map((item) => updateStock(item.product, item.quantity))
  );
  order.stockReduced = true;
}

async function emitOrderUpdated(orderId) {
  const io = getIO();
  if (!io) return;

  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) return;

  const payload = { order };
  io.to(`order:${orderId.toString()}`).emit("order:updated", payload);
  io.to(`user:${order.user._id.toString()}`).emit("order:updated", payload);
  io.to("role:admin").emit("order:updated", payload);
}

async function notifyAdminsForReturnRequest(order) {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL;
  if (!adminEmail) return;

  const orderId = order?._id?.toString();
  const customerName = order?.user?.name || "Customer";
  const customerEmail = order?.user?.email || "N/A";
  const reason = order?.returnRequest?.reason || "Not provided";

  await sendEmail({
    email: adminEmail,
    subject: `Return request received for order ${orderId}`,
    message: `A return request has been submitted.\nOrder ID: ${orderId}\nCustomer: ${customerName} (${customerEmail})\nReason: ${reason}`,
  });
}

async function updateStock(id, quantity) {
  if (!id) {
    throw new Errorhandler("Invalid product reference found in order item", 400);
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new Errorhandler("Product not found while updating stock", 404);
  }

  const qty = Number(quantity || 0);
  if (qty <= 0) {
    throw new Errorhandler("Invalid quantity found while updating stock", 400);
  }

  if (product.Stock < qty) {
    throw new Errorhandler(`Insufficient stock for product: ${product.name}`, 400);
  }

  product.Stock -= qty;
  await product.save({ validateBeforeSave: false });
  return product;
}

// delete order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully"
  });
});
