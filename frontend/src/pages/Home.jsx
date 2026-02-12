// src/pages/Home.jsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import Loading from '../component/common/Loading';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  Shield,
  Zap,
  TrendingUp,
  Package,
  Heart,
  Star,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Lock,
  Database,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Layers,
  Smartphone
} from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const categoryRowRefs = useRef({});

  const productsByCategory = useMemo(() => {
    if (!Array.isArray(products)) return {};
    return products.reduce((acc, product) => {
      const category = product?.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      if (acc[category].length < 8) {
        acc[category].push(product);
      }
      return acc;
    }, {});
  }, [products]);

  const renderStars = (ratings = 0) => {
    const fullStars = Math.round(ratings);
    return Array.from({ length: 5 }).map((_, i) => (
      <AiFillStar
        key={i}
        className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const scrollCategoryRow = (categoryKey, direction) => {
    const row = categoryRowRefs.current[categoryKey];
    if (!row) return;
    const amount = direction === 'left' ? -360 : 360;
    row.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({
      keyword: '',
      currentPage: 1,
      price: [0, 25000],
      category: '',
      limit: 100,
      ratings: 0
    }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-violet-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div className="animate-fade-in-up">

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Shopora <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                Modern E-Commerce Engine
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              A full-stack MERN eCommerce platform built with JWT authentication,
              real-time order tracking using Socket.IO, dynamic inventory control,
              and modular REST API architecture.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/product"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 px-7 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Explore Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/yourusername/shopora"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/40 px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Source Code
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              {[
                { value: 'Protected', label: 'Private Routes', icon: Shield },
                { value: 'Real-Time', label: 'Order Tracking', icon: Zap },
                { value: 'Modular', label: 'Backend Structure', icon: Layers },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-sm text-white/80">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE FEATURE GRID */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
            {[
              { icon: Lock, title: "JWT Auth", desc: "Secure login & protected routes", gradient: "from-pink-500 to-rose-500" },
              { icon: Zap, title: "Real-Time", desc: "Live order updates", gradient: "from-yellow-500 to-orange-500" },
              { icon: Database, title: "MongoDB", desc: "Scalable data layer", gradient: "from-green-500 to-emerald-500" },
              { icon: LayoutDashboard, title: "Admin Panel", desc: "Full product control", gradient: "from-blue-500 to-cyan-500" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Glow Effects */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-500/20 blur-3xl rounded-full animate-pulse-slow animation-delay-1000"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto px-6 py-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-wrap items-center justify-center gap-12">
            {[
              { icon: Layers, text: 'Modular REST API Structure', color: 'text-indigo-600' },
              { icon: Lock, text: 'Password Hashing + Tokens', color: 'text-green-600' },
              { icon: LayoutDashboard, text: 'Admin Control Panel', color: 'text-purple-600' },
              { icon: Smartphone, text: 'Fully Responsive UI', color: 'text-orange-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: 'Free Shipping',
              description: 'On orders over ₹500',
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50'
            },
            {
              icon: Shield,
              title: 'Secure Payment',
              description: '100% protected checkout',
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50'
            },
            {
              icon: Zap,
              title: 'Fast Delivery',
              description: 'Express shipping available',
              gradient: 'from-orange-500 to-red-500',
              bgGradient: 'from-orange-50 to-red-50'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent rounded-full" />
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Explore Our{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Collections
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Discover handpicked products crafted with care and quality
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <div className="mb-8 inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts({
                keyword: '',
                currentPage: 1,
                price: [0, 25000],
                category: '',
                ratings: 0
              }))}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full transform hover:scale-105 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl"
            >
              Try Again
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : products && Array.isArray(products) && products.length > 0 ? (
          <div className="space-y-20">
            {Object.entries(productsByCategory).map(([category, items], categoryIndex) => (
              <div key={category} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-3 h-16 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 rounded-full" />
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-gray-900 mb-1">{category}</h3>
                      <p className="text-gray-500 font-medium flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {items.length} premium products
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => scrollCategoryRow(category, 'left')}
                      className="w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-gray-100 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
                      aria-label={`Scroll ${category} left`}
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => scrollCategoryRow(category, 'right')}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl hover:shadow-2xl text-white transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
                      aria-label={`Scroll ${category} right`}
                    >
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Products Row */}
                <div
                  className="flex gap-8 overflow-x-hidden pb-8 scroll-smooth"
                  ref={(el) => {
                    categoryRowRefs.current[category] = el;
                  }}
                >
                  {items.map((product, productIndex) => {
                    const imageUrl =
                      product.image?.[0]?.url ||
                      product.images?.[0]?.url ||
                      product.image?.url ||
                      'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                      <Link
                        to={`/product/${product._id}`}
                        key={product._id || product.id}
                        className="group w-80 shrink-0 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-indigo-300 overflow-hidden hover:-translate-y-3 hover:scale-105"
                        style={{
                          animation: `slideInFromRight 0.6s ease-out ${productIndex * 0.1}s both`
                        }}
                      >
                        {/* Image Container */}
                        <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-indigo-50">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                              FEATURED
                            </div>
                            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group/heart">
                              <Heart className="w-5 h-5 text-gray-400 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-all" />
                            </button>
                          </div>

                          {/* Quick View Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 flex items-center gap-2 shadow-xl">
                              <Eye className="w-4 h-4" />
                              Quick View
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-full">
                              {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              {product.ratings?.toFixed(1) || '0.0'}
                            </div>
                          </div>

                          <h4 className="text-xl font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                            {product.name}
                          </h4>

                          {/* Rating Details */}
                          <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center gap-0.5">
                              {renderStars(product.ratings)}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({product.numOfReviews || 0} reviews)
                            </span>
                          </div>

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1 font-medium">Price</p>
                              <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ₹{product.price || 0}
                              </p>
                            </div>
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-2xl hover:shadow-xl transition-all duration-300 group-hover:scale-110 active:scale-95">
                              <ShoppingBag className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="mb-10 inline-block">
              <div className="w-40 h-40 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                <Package className="w-20 h-20 text-gray-400" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-4">No Products Available</h3>
            <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto leading-relaxed">
              We're working hard to bring you amazing products. Check back soon!
            </p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold">
              <Award className="w-5 h-5" />
              Notify Me When Available
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTIwIDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek00IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          <div className="relative text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-white/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Get Exclusive Deals
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Subscribe to our newsletter and get 20% off your first order
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-all"
              />
              <button className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float-particles {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
          }
          50% {
            transform: translate(100px, -100px);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }

        .animate-float-particles {
          animation: float-particles 15s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar but keep functionality */
        .overflow-x-hidden::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Missing Eye icon import - adding inline
const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default Home;