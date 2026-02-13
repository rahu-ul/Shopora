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

const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '');
const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(normalizeOrigin(origin))) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true, // <-- Yeh zaroori hai Cloudinary ke liye
}));

// Importing routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

// Using routes
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use(errorMiddleware);

module.exports = app;
