const express = require('express');
const router = express.Router();

const { isAuthenticatedUser } = require('../middleware/auth');
const  { authorizeRole } = require('../middleware/auth'); // Importing the authorizeRole middleware
const {
    newOrder,
    getSingleOrder,
    myOrders,
    cancelMyOrder,
    requestReturn,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getAdminOrder
} = require('../controllers/orderController');

router.route("/order/new")
    .post(isAuthenticatedUser, newOrder) // Route to

router.route("/order/:id")
    .get(isAuthenticatedUser,  getSingleOrder); // Route to

router.route("/orders/me")
    .get(isAuthenticatedUser, myOrders); // Route to get logged in user's orders

router.route("/order/:id/cancel")
    .put(isAuthenticatedUser, cancelMyOrder); // Route to cancel own order

router.route("/order/:id/return")
    .put(isAuthenticatedUser, requestReturn); // Route to request return

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRole("admin"), getAllOrders); // Route to get all orders for admin creating a new order

router.route("/admin/order/:id")
    .get(isAuthenticatedUser, authorizeRole("admin"), getAdminOrder) // Route to get a single order by admin
    .put(isAuthenticatedUser, authorizeRole("admin"), updateOrder) // Route to get a single order by admin
    .delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder); // Route to delete an order by admin

module.exports = router; // Exporting the router for use in other files
