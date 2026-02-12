class Errorhandler extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor with the error message
    this.statusCode = statusCode; // Set the HTTP status code
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }
}


module.exports = Errorhandler; // Export the Errorhandler class for use in other files