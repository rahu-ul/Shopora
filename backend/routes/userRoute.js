const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController'); // Importing the registerUser controller
const { isAuthenticatedUser,  authorizeRole } = require('../middleware/auth'); // Importing the isAuthenticatedUser middleware

// Defining a route to register a new user
router.route("/register").post(registerUser);
router.route("/login").post(loginUser); // Defining a route to login a user
router.route("/forgetPassword").post(forgotPassword);
// Support conventional path as well
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword); // Route to reset password using token
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails );
router.route("/password/update").put(isAuthenticatedUser, updatePassword); // Route to update user password
router.route("/me/update").put(isAuthenticatedUser, updateProfile); // Route to update user profile

router.route("/admin/users").get(isAuthenticatedUser, authorizeRole("admin"), getAllUsers); // Route to get all users (admin only)
router
.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRole("admin"), getSingleUser)// Route to get user details by ID (admin only)
.put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole) // Route to update user profile by ID (admin only)
.delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser); // Route to delete user by ID (admin only)

module.exports = router; // Exporting the router for use in other files