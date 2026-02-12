const express = require('express');
const router = express.Router();
const {getAllProduct, getProductCategories, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview} = require('../controllers/productController'); // Importing the getAllProduct controller
const { isAuthenticatedUser } = require('../middleware/auth');
const  { authorizeRole } = require('../middleware/auth'); // Importing the authorizeRole middleware

router.route("/products").get(  getAllProduct); // Defining a route to get all products
router.route("/products/categories").get(getProductCategories);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRole("admin"), getAllProduct); // Admin route to get all products
router.route("/admin/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct); 
router.route("/admin/products/:id")
.put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)
// Defining a route to update, delete, and get product details by ID

router.route("/product/:id").get(getProductDetails); // Defining a route to get product details by ID
router.route("/reviews").put(isAuthenticatedUser, createProductReview); // Route to create a product review
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview); // Route to get product reviews
module.exports = router; // Exporting the router for use in other files
