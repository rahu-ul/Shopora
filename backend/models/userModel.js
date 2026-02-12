const mongoose = require('mongoose');
const validator = require('validator'); // Importing validator for email validation
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing jwt for token generation
const crypto = require('crypto'); // Importing crypto for generating reset password tokens

const userSchema = new mongoose.Schema({
     name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // If password is not modified, proceed to the next middleware
  }

  this.password = await bcrypt.hash(this.password, 10); // Hashing the password with bcrypt
});

// Method to generate JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE, // Token expiration time
    });
    }

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Comparing entered password with hashed password
};

// Method to generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generating a token using crypto
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing the token and setting it to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Setting the expiration time for the reset password token
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token valid for 30 minutes

  return resetToken; // Returning the plain token
};

module.exports = mongoose.model("User", userSchema); // Exporting the User model


