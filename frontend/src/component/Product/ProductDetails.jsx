// src/component/Product/ProductDetails.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsShieldCheck, BsTruck, BsBoxSeam } from 'react-icons/bs';
import { MdLocalShipping } from 'react-icons/md';
import { fetchProductDetails, clearErrors } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Loading from '../common/Loading';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Ratings ko display karne ke liye helper function
  const renderStars = (ratings) => {
    const stars = [];
    const fullStars = Math.floor(ratings);
    const hasHalfStar = ratings % 1 !== 0;
    const emptyStars = 5 - Math.ceil(ratings);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<AiFillStar key={`full-${i}`} className="text-yellow-400 inline-block w-5 h-5" />);
    }
    if (hasHalfStar) {
      stars.push(<AiFillStar key="half" className="text-yellow-400 inline-block w-5 h-5" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<AiOutlineStar key={`empty-${i}`} className="text-gray-300 inline-block w-5 h-5" />);
    }
    return stars;
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(fetchProductDetails(id));
  }, [dispatch, id, error]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [product._id]);

  const increaseQuantity = () => {
    if (!product.Stock || quantity >= product.Stock) {
      toast.warning('Cannot add more items. Stock limit reached!');
      return;
    }
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    }
    setQuantity(prev => prev - 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > product.Stock) {
      setQuantity(product.Stock);
      toast.info(`Only ${product.Stock} items available in stock!`);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product.Stock || product.Stock === 0) {
      toast.error('Product is out of stock!');
      return;
    }

    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image?.[0]?.url || product.image?.url,
      stock: product.Stock,
      quantity: quantity,
    }));
    
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to submit a review');
      return;
    }
    if (!rating) {
      toast.warning('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.warning('Please write a review');
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/reviews`,
        { rating, comment, productId: product._id },
        { withCredentials: true }
      );
      toast.success('Review submitted');
      setRating(0);
      setComment('');
      dispatch(fetchProductDetails(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!product || !product._id) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <BsBoxSeam className="text-4xl text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const images = product.image ? (Array.isArray(product.image) ? product.image : [product.image]) : [];
  const currentImage = images[selectedImage]?.url || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Left: Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group overflow-hidden rounded-2xl bg-gray-50 aspect-square">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  {product.Stock > 0 ? (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-blue-500 shadow-lg scale-110' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500">Product ID: <span className="font-mono">{product._id}</span></p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {renderStars(product.ratings || 0)}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.ratings?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                  {product.numOfReviews || 0} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-lg">inclusive of all taxes</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <BsBoxSeam className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Availability</p>
                  <p className={`text-lg font-bold ${product.Stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.Stock > 0 ? `${product.Stock} units available` : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              {product.Stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={decreaseQuantity} 
                        disabled={quantity <= 1}
                        className={`px-5 py-3 text-xl font-bold transition-all duration-200 ${
                          quantity <= 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.Stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-20 text-center text-xl font-bold border-none focus:outline-none py-3 bg-white"
                      />
                      <button 
                        onClick={increaseQuantity}
                        disabled={quantity >= product.Stock}
                        className={`px-5 py-3 text-xl font-bold transition-all duration-200 ${
                          quantity >= product.Stock 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      disabled={product.Stock === 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}

              {/* Out of Stock Message */}
              {product.Stock === 0 && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <BsBoxSeam className="text-2xl text-red-600" />
                    </div>
                    <div>
                      <p className="text-red-900 font-bold text-lg">Out of Stock</p>
                      <p className="text-red-700 text-sm">This product is currently unavailable</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <BsShieldCheck className="text-2xl text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <BsTruck className="text-2xl text-green-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <MdLocalShipping className="text-2xl text-purple-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Fast Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-gray-200">
            <AiFillStar className="text-4xl text-yellow-400" />
            <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
          </div>

          {/* Submit Review Form */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-sm mb-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
              Write a Review
            </h3>
            <p className="text-gray-600">Share your experience with this product</p>
            <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Your Rating</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <AiFillStar
                        className={`${rating >= star ? 'text-yellow-500' : 'text-gray-300'} w-7 h-7`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Your Review</p>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your review here..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
              {!isAuthenticated && (
                <p className="text-xs text-gray-500">Login required to post a review.</p>
              )}
            </form>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              <>
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  All Reviews ({product.reviews.length})
                </h4>
                {product.reviews.map((review, index) => (
                  <div 
                    key={review._id} 
                    className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{review.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Review #{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-15">{review.comment}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AiOutlineStar className="text-4xl text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
