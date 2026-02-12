const Errorhandler = require('../Utils/Errorhandler'); // Importing the Errorhandler class


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Default to 500 if statusCode is not set
  err.message = err.message || 'Internal Server Error'; // Default message


   // Wrong Mongodb Id error handler
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  // Mongoose duplicate key error handler
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new Errorhandler(message, 400);
  }


  // Mongoose validation error handler
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(value => value.message);
    err = new Errorhandler(message, 400);
  }

  // JWT token error handler
  if (err.name === "JsonWebTokenError") { 
    const message = 'Json Web Token is invalid. Try again';
    err = new Errorhandler(message, 400);
  }

  // JWT token expiration error handler
  if (err.name === "TokenExpiredError") {
    const message = 'Json Web Token is expired. Try again';
    err = new Errorhandler(message, 400);
  }

  // Log error details for debugging
  console.error(err);

  // Send the error response
  res.status(err.statusCode).json({
    success: false,
    error: err.stack,
    message: err.message
  });
}   
