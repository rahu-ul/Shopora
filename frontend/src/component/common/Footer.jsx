import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhone, FaHeart } from 'react-icons/fa';
import './Footer.css';
import Faq from '../common/Faq';
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="modern-footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <div className="logo-circle-footer">
                <div className="logo-circle">
                  <img
                    src="/kk.png"
                    alt="Shopora Logo"
                    className="h-10 w-10 object-contain rounded-full"
                  />
                  {/* <span className="logo-text">YL</span> */}
                </div>
              </div>
              <span className="ml-2 text-2xl font-bold 
  bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 
  bg-clip-text text-transparent">
                Shopora
              </span>
            </div>
            <p className="Shopora description">
              Shopora is a modern full-stack eCommerce platform built for scalability, security, and performance, delivering a seamless digital shopping experience.
            </p>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>G.L bajaj group of institution, Mathura</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 9105989864</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a href="/" className="social-link facebook" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="/" className="social-link instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="/" className="social-link twitter" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="/product" className="footer-link">
                  <span className="link-arrow">→</span>
                  Shop All
                </a>
              </li>
              <li>
                <a href="/Faq" className="footer-link">
                  <span className="link-arrow">→</span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="/cart" className="footer-link">
                  <span className="link-arrow">→</span>
                  My Cart
                </a>
              </li>
              <li>
                <a href="/PrivacyPolicy" className="footer-link">
                  <span className="link-arrow">→</span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-links">
              <li>
                <a href="/contact" className="footer-link">
                  <span className="link-arrow">→</span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/orders" className="footer-link">
                  <span className="link-arrow">→</span>
                  Shipping Info
                </a>
              </li>
              <li>
                <Link to="/orders" className="footer-link">
                  <span className="link-arrow">→</span>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">
                  <span className="link-arrow">→</span>
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section newsletter-section">
            <h3 className="footer-heading">Join Our Newsletter</h3>
            <p className="newsletter-description">
              Stay up to date with new products and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button
                  type="submit"
                  className="newsletter-button"
                  aria-label="Subscribe"
                >
                  <FaEnvelope />
                </button>
              </div>
              {isSubscribed && (
                <div className="subscribe-success">
                  ✓ Successfully subscribed!
                </div>
              )}
            </form>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <span className="badge-icon">🔒</span>
                <span className="badge-text">Secure Payment</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">🚚</span>
                <span className="badge-text">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} [Shopora]. All rights reserved.
          </p>
          <p className="made-with">
            Made with <FaHeart className="heart-icon" /> by Rahul Sharma
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;