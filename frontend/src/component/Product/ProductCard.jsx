// src/components/Product/ProductCard.jsx

import React from 'react';
import { AiFillStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsCartPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const renderStars = (ratings) => {
    const stars = [];
    const fullStars = Math.floor(ratings);
    const hasHalfStar = ratings % 1 !== 0;
    const emptyStars = 5 - Math.ceil(ratings);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<AiFillStar key={`full-${i}`} className="star-icon star-filled" />);
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star-half-container">
          <AiFillStar className="star-icon star-filled star-half-left" />
          <AiFillStar className="star-icon star-empty star-half-right" />
        </span>
      );
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<AiFillStar key={`empty-${i}`} className="star-icon star-empty" />);
    }
    
    while (stars.length < 5) {
      stars.push(<AiFillStar key={`empty-fill-${stars.length}`} className="star-icon star-empty" />);
    }

    return stars;
  };
  
  if (!product) {
    return null;
  }
  
  // Support different image shapes from backend
  const imageUrl =
    product.image?.[0]?.url ||
    product.images?.[0]?.url ||
    product.image?.url ||
    'https://via.placeholder.com/300x200?text=No+Image';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  // Calculate discount if original price exists
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        {/* Image Container */}
        <div className="product-image-container">
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            className="product-image"
          />
          
          {/* Badges */}
          <div className="product-badges">
            {hasDiscount && (
              <span className="badge badge-discount">-{discountPercentage}%</span>
            )}
            {product.stock === 0 && (
              <span className="badge badge-stock">Out of Stock</span>
            )}
            {product.isNew && (
              <span className="badge badge-new">New</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button 
            className="wishlist-btn"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
          >
            {isWishlisted ? (
              <AiFillHeart className="wishlist-icon filled" />
            ) : (
              <AiOutlineHeart className="wishlist-icon" />
            )}
          </button>

          {/* Quick View Overlay */}
          <div className="quick-view-overlay">
            <span className="quick-view-text">Quick View</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          {/* Category */}
          <p className="product-category">{product.category || 'Category'}</p>

          {/* Product Name */}
          <h3 className="product-name">
            {product.name || 'Product Name'}
          </h3>

          {/* Rating */}
          <div className="product-rating">
            <div className="stars-container">
              {renderStars(product.ratings)}
            </div>
            <span className="rating-text">
              {product.ratings?.toFixed(1) || '0.0'}
            </span>
            <span className="reviews-count">
              ({product.numOfReviews || 0})
            </span>
          </div>

          {/* Price Section */}
          <div className="product-price-section">
            <div className="price-container">
              {hasDiscount && (
                <span className="original-price">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="current-price">
                ₹{product.price ? product.price.toFixed(2) : '0.00'}
              </span>
            </div>

            {/* Shop Button */}
            <button className="shop-btn">
              <BsCartPlus className="cart-icon" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;