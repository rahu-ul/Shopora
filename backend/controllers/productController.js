const Product = require('../models/productModel'); // Importing the Product model
const Errorhandler = require('../Utils/Errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors'); // Importing the catchAsyncErrors middleware
const ApiFeatures = require('../Utils/apiFeature');
const cloudinary = require('cloudinary');



// now create the product - admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; // Assigning the user ID to the product being created

  // Normalize stock field name (frontend sends `stock`, model expects `Stock`)
  if (req.body && typeof req.body.stock !== 'undefined' && typeof req.body.Stock === 'undefined') {
    req.body.Stock = req.body.stock;
  }

  // Normalize images input (supports base64 strings in req.body.images or file uploads in req.files.images)
  let images = [];
  if (req.body && req.body.images) {
    images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
  } else if (req.files && req.files.images) {
    images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
  }

  const imagesLinks = [];
  for (const image of images) {
    if (!image) continue;
    const uploadSource = image.tempFilePath ? image.tempFilePath : image;
    const uploaded = await cloudinary.v2.uploader.upload(uploadSource, {
      folder: 'products',
    });
    imagesLinks.push({
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    });
  }

  req.body.image = imagesLinks;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
  
}); // This function handles the request to create a new product and sends a response back to the client





// This function handles the request to get all products and sends a response back to the client
// get all product
exports.getAllProduct = catchAsyncErrors(async(req, res) => {

  const resultPerPage = Number(req.query.limit) || 6; // Set the number of products per page
  const apiFeatures = new ApiFeatures(Product.find(), req.query) // Creating an instance of ApiFeatures with the Product model and query parameters
    .search()
    .filter(); // Apply search and filter first
  
  // Get filtered products count - create a separate query for counting
  const countQuery = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  const filteredProductsCount = await Product.countDocuments(countQuery.query);
  
  // Apply pagination only for non-admin list
  const isAdminList = req.originalUrl && req.originalUrl.includes('/admin/products');
  if (!isAdminList) {
    apiFeatures.pagination(resultPerPage);
  }
  const product = await apiFeatures.query; // Executing the query to get the products
  
  res.status(200).json({
      success: true,
      product,
      products: product,
      productCount: filteredProductsCount,
      resultPerPage
  });
});

exports.getProductCategories = catchAsyncErrors(async (req, res) => {
  const categories = await Product.distinct('category');
  const normalizedCategories = categories
    .map((cat) => (typeof cat === 'string' ? cat.trim() : cat))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  res.status(200).json({
    success: true,
    categories: normalizedCategories,
  });
});


// get product detail
exports.getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id); // Finding the product by ID
  if (!product) {
    return next(new Errorhandler('Product not found', 404)); // If product not found, throw an error
  }
  res.status(200).json({
    success: true,
    product,
 
  });
};


//update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id); // Finding the product by ID
  if (!product) {
    return next(new Errorhandler('Product not found', 404));
  }

  // Normalize stock field name (frontend sends `stock`, model expects `Stock`)
  if (req.body && typeof req.body.stock !== 'undefined' && typeof req.body.Stock === 'undefined') {
    req.body.Stock = req.body.stock;
  }

  // Handle image replacement if new images are provided
  let images = [];
  if (req.body && req.body.images) {
    images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
  } else if (req.files && req.files.images) {
    images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
  }

  if (images.length > 0) {
    const imagesLinks = [];
    for (const image of images) {
      if (!image) continue;
      const uploadSource = image.tempFilePath ? image.tempFilePath : image;
      const uploaded = await cloudinary.v2.uploader.upload(uploadSource, {
        folder: 'products',
      });
      imagesLinks.push({
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      });
    }
    req.body.image = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  res.status(200).json({
    success: true,
    product
  });
});


// delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new Errorhandler('Product not found', 404));
    }

      await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  
}); // This function handles the request to delete a product and sends a response back to the client


// give review and udate review 
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body; // Destructuring the request body to get rating, comment, and productId

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId); // Finding the product by ID

  if (!product) {
    return next(new Errorhandler('Product not found', 404)); // If product not found, throw an error
  }

  // Check if the user has already reviewed the product
  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    // If already reviewed, update the review
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    // If not reviewed yet, add a new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length; // Update the number of reviews
  }

  let avg = 0;
  product.reviews.forEach(rev => {
    avg += rev.rating; // Calculate the average rating
  });
  
  product.ratings = avg / product.reviews.length; // Set the average rating

  await product.save({ validateBeforeSave: false }); // Save the updated product

  res.status(200).json({
    success: true,
    message: 'Review added successfully'
  });
} 
);

// get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id); // Finding the product by ID
  if (!product) { 
    return next(new Errorhandler('Product not found', 404)); // If product not found, throw an error
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews // Sending the reviews of the product
  });
}
);

// delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId); // Finding the product by ID 
  if (!product) {
    return next(new Errorhandler('Product not found', 404)); // If product not found, throw an error
  }
  const reviews = product.reviews.filter(
    rev => rev._id.toString() !== req.query.id.toString() // Filtering out the review to be deleted
  );
  let avg = 0;
  reviews.forEach(rev => {
    avg += rev.rating; // Calculate the average rating
  });
  const ratings = reviews.length === 0 ? 0 : avg / reviews.length; // Set the average rating to 0 if no reviews left
  const numOfReviews = reviews.length; // Update the number of reviews
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  }); 
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
}
);
