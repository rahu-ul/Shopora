const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token verification
const User = require('../models/userModel'); // Importing the User model
const ErrorHandler = require('../Utils/Errorhandler'); // Importing custom error handler

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies; // Extracting the token from cookies
    
    if (!token) {
       return next(new ErrorHandler('Please login to access this resource', 401)); // If token is not present, throw an error
    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token
    
    req.user = await User.findById(decodedData.id); // Fetching user details from the database
    next(); // Proceed to the next middleware or route handler  
});


exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { // Checking if the user's role is included in the allowed roles
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)); // If not, throw an error
        }
        next(); // Proceed to the next middleware or route handler
    };
}