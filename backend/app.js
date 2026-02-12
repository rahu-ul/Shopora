// app.js

const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// -------------------------
// Normalize Origin Function
// -------------------------
const normalizeOrigin = (value = '') =>
  value.trim().replace(/\/+$/, '');

// -------------------------
// Allowed Origins From ENV
// -------------------------
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

// -------------------------
// CORS Options
// -------------------------
const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server or Postman requests
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// -------------------------
// Middlewares
// -------------------------

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// -------------------------
// Routes
// -------------------------

const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);

// -------------------------
// Error Middleware
// -------------------------

app.use(errorMiddleware);

module.exports = app;
