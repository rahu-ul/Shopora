// src/components/Header.jsx
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog, FaTachometerAlt, FaShoppingBag } from 'react-icons/fa';
import { logoutUser } from '../../redux/slices/userSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [showIcons, setShowIcons] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState('');
  const hideTimerRef = useRef(null);
  const { totalItems } = useSelector(state => state.cart);

  // Avatar hover handlers
  const handleAvatarMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowIcons(true);
  };

  const handleAvatarMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setShowIcons(false);
      setHoveredIcon('');
    }, 400);
  };

  const handleAvatarClick = () => {
    setShowIcons(prev => !prev);
  };

  // Icon hover handlers
  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon('');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    alert("Logged out successfully");
    navigate('/login');
    setShowIcons(false);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo Section */}
        <Link to="/" className="logo-section">
          <div className="logo-circle">
            <img
              src="/kk.png"
              alt="Shopora Logo"
              className="h-10 w-10 object-contain rounded-full"
            />
            {/* <span className="logo-text">YL</span> */}
          </div>
          <span className="ml-2 text-2xl font-bold 
  bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 
  bg-clip-text text-transparent">
            Shopora
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            <span className="nav-link-text">Home</span>
            <span className="nav-link-underline"></span>
          </Link>
          <Link to="/product" className="nav-link">
            <span className="nav-link-text">Products</span>
            <span className="nav-link-underline"></span>
          </Link>
          <Link to="/about" className="nav-link">
            <span className="nav-link-text">About</span>
            <span className="nav-link-underline"></span>
          </Link>
          <Link to="/contact" className="nav-link">
            <span className="nav-link-text">Contact</span>
            <span className="nav-link-underline"></span>
          </Link>
        </nav>

        {/* Right Section: Auth & Cart */}
        <div className="header-actions">
          {isAuthenticated ? (
            // Avatar section with icon display on hover
            <div
              className="avatar-container"
              onMouseEnter={handleAvatarMouseEnter}
              onMouseLeave={handleAvatarMouseLeave}
              onClick={handleAvatarClick}
            >
              {/* Avatar */}
              <div className="user-avatar">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user?.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <FaUser />
                    <span className="user-name">{user?.name?.charAt(0) || 'U'}</span>
                  </>
                )}
              </div>

              {/* Icons that appear on hover */}
              {showIcons && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user?.avatar?.url ? (
                          <img
                            src={user.avatar.url}
                            alt={user?.name || 'User'}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="user-details">
                        <p className="user-name-text">{user?.name || 'User'}</p>
                        <p className="user-email">{user?.email || ''}</p>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-items">
                    {/* Admin Dashboard Icon */}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="dropdown-item"
                        onMouseEnter={() => handleIconHover('Dashboard')}
                        onMouseLeave={handleIconLeave}
                      >
                        <FaTachometerAlt className="dropdown-icon" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    {/* Profile Icon */}
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onMouseEnter={() => handleIconHover('Profile')}
                      onMouseLeave={handleIconLeave}
                    >
                      <FaUser className="dropdown-icon" />
                      <span>My Profile</span>
                    </Link>

                    {/* Orders Icon */}
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onMouseEnter={() => handleIconHover('Orders')}
                      onMouseLeave={handleIconLeave}
                    >
                      <FaShoppingBag className="dropdown-icon" />
                      <span>My Orders</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    {/* Logout Icon */}
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                      onMouseEnter={() => handleIconHover('Logout')}
                      onMouseLeave={handleIconLeave}
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="cart-link">
            <div className="cart-icon-wrapper">
              <FaShoppingCart className="cart-icon" />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
