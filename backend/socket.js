const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const Order = require("./models/orderModel");

let ioInstance = null;

function parseCookieHeader(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [rawKey, ...rawVal] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawVal.join("=") || "");
    return acc;
  }, {});
}

function initializeSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // 🔐 Socket authentication middleware
  ioInstance.use(async (socket, next) => {
    try {
      const cookies = parseCookieHeader(socket.handshake.headers.cookie || "");
      const authToken = socket.handshake.auth?.token;
      const token = cookies.token || authToken;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  // 🔌 Connection handler
  ioInstance.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.user._id.toString());

    // Join personal room
    socket.join(`user:${socket.user._id.toString()}`);

    // Admin room
    if (socket.user.role === "admin") {
      socket.join("role:admin");
    }

    // Join order room
    socket.on("join_order", async (orderId) => {
      try {
        if (!orderId) return;

        const order = await Order.findById(orderId).select("user");
        if (!order) return;

        const isOwner =
          order.user.toString() === socket.user._id.toString();
        const isAdmin = socket.user.role === "admin";

        if (!isOwner && !isAdmin) return;

        socket.join(`order:${orderId}`);
      } catch (error) {
        console.log("Join order error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.user._id.toString());
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
}

module.exports = { initializeSocket, getIO };
