const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },  
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    stockReduced: {
        type: Boolean,
        default: false
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    returnRequest: {
        requested: {
            type: Boolean,
            default: false
        },
        reason: {
            type: String
        },
        requestedAt: {
            type: Date
        }
    },
    orderLocked: {
        type: Boolean,
        default: false
    },
    tracking: {
        courier: {
            type: String
        },
        trackingId: {
            type: String
        }
    },
    deliveryNotes: {
        delayReason: {
            type: String
        },
        adminComments: {
            type: String
        }
    },
    deliveredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
