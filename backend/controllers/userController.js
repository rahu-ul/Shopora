const ErrorHandler = require('../Utils/Errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel'); // Importing the User model
const sendToken = require('../Utils/jwtToken'); // Utility to send JWT token
const sendEmail = require('../Utils/sendEmail'); // Utility to send emails
const crypto = require('crypto'); // Importing crypto for generating reset password tokens
const cloudinary = require('cloudinary'); // Importing Cloudinary for image uploads

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const escapeRegex = (text = '') => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Handle optional avatar upload gracefully
  let avatarData = {
    public_id: 'default_avatar',
    url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&rounded=true&size=150`,
  };

  if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
    const uploaded = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    avatarData = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  } else if (req.body && req.body.avatar) {
    // Support base64 data URI uploads as well
    const uploaded = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    avatarData = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  const user = await User.create({
    name,
    email: normalizeEmail(email),
    password,
    avatar: avatarData,
  });

  sendToken(user, 201, res); // Send the token and user data in the response
});


// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  const normalizedEmail = normalizeEmail(email);
  const emailRegex = new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i');

  // Find user by email (case-insensitive) and check password
  const user = await User.findOne({ email: emailRegex }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Ensure avatar is a valid URL (handle legacy demo URL)
  const needsAvatarFallback = !user.avatar || !user.avatar.url || (typeof user.avatar.url === 'string' && user.avatar.url.includes('res.cloudinary.com/demo'));
  if (needsAvatarFallback) {
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&rounded=true&size=150`;
    user.avatar = { public_id: 'default_avatar', url: fallbackUrl };
  }

  sendToken(user, 200, res); // Send the token and user data in the response
});


// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()), // <-- Token ko expire karne ka sahi tareeka
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// function for forget password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }
  // Get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n If you have not requested this, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Recovery',
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorHandler('Reset password token is invalid or has expired', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});


// Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const needsAvatarFallback = !user.avatar || !user.avatar.url || (typeof user.avatar.url === 'string' && user.avatar.url.includes('res.cloudinary.com/demo'));
  if (needsAvatarFallback) {
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&rounded=true&size=150`;
    user.avatar = { public_id: 'default_avatar', url: fallbackUrl };
  }

  res.status(200).json({
    success: true,
    user
  });
});


// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// update user Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Only set avatar when a new one is provided
  let avatarData = null;

  if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
    const uploaded = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    avatarData = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  } else if (req.body && req.body.avatar) {
    // Support base64 data URI uploads as well
    const uploaded = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    avatarData = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  if (!avatarData && (req.body && (req.body.name || req.body.email))) {
    // Keep user avatar unchanged; if you want a fallback when missing entirely,
    // compute a deterministic fallback based on provided name.
    if (typeof req.body.name === 'string' && req.body.name.trim().length > 0) {
      avatarData = {
        public_id: 'default_avatar',
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=random&rounded=true&size=150`,
      };
    }
  }

  if (avatarData) {
    newUserData.avatar = avatarData;
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user
  });
});


// get all users (Admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  });
});

// get single user (Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// update user role (Admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };
  // add cloudary later
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  res.status(200).json({
    success: true,
    user
  });
});


// delete user (Admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  await user.deleteOne(); // remove() ki jagah
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});
