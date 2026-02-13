const app = require('./app'); // Importing the app instance from app.js
const http = require('http');
const dotenv = require('dotenv'); // Importing dotenv to manage environment variables
const path = require('path');
const connectDatabase = require('./config/database'); // Importing the database connection function
const cloudinary = require('cloudinary');
const stripe = require('stripe');
const { initializeSocket } = require('./socket');


// uncaught error
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);   
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);  
});

//config
dotenv.config({ path: path.join(__dirname, 'config', '.env') });


//connecting to database
connectDatabase();

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const httpServer = http.createServer(app);
initializeSocket(httpServer);

const server = httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});



// unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');

  server.close(() => {
    process.exit(1);
  });


});
