// src/pages/Profile.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  ShoppingBag,
  Lock,
  Award,
  Shield,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Camera
} from 'lucide-react';

const Profile = () => {
    const { user, loading } = useSelector((state) => state.user);

    // Format date properly
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Calculate account age
    const getAccountAge = (dateString) => {
        if (!dateString) return null;
        const joinDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) return `${diffDays} days`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
        return `${Math.floor(diffDays / 365)} years`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-md border border-gray-200">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-gray-700">Your Account</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-3">
                        My <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Profile</span>
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your personal information and preferences</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <User className="w-10 h-10 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Avatar Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 sticky top-8">
                                {/* Avatar Section */}
                                <div className="relative mb-6">
                                    <div className="relative w-40 h-40 mx-auto">
                                        {/* Gradient Ring */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full p-1">
                                            <div className="w-full h-full bg-white rounded-full p-1">
                                                <img
                                                    src={user?.avatar?.url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&size=200&background=6366f1&color=fff&bold=true'}
                                                    alt={user?.name || 'User'}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Camera Badge */}
                                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white cursor-pointer hover:scale-110 transition-transform">
                                            <Camera className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* User Name */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                                    <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
                                </div>

                                {/* Member Badge */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6 border border-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Member for</p>
                                            <p className="text-lg font-bold text-indigo-700">{getAccountAge(user?.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Profile Button */}
                                <Link 
                                    to="/profile/update" 
                                    className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                                >
                                    <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Details and Actions */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Account Information Card */}
                            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-500 text-sm font-semibold mb-1">Full Name</h4>
                                                <p className="text-xl font-bold text-gray-900">{user?.name || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="text-gray-500 text-sm font-semibold mb-1">Email Address</h4>
                                                <p className="text-xl font-bold text-gray-900 truncate">{user?.email || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Joined Date */}
                                    <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-500 text-sm font-semibold mb-1">Joined On</h4>
                                                <p className="text-xl font-bold text-gray-900">{formatDate(user?.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl p-6 border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-500 text-sm font-semibold mb-1">Account Status</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <p className="text-xl font-bold text-emerald-600">Active</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* My Orders */}
                                    <Link 
                                        to="/orders" 
                                        className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <ShoppingBag className="w-7 h-7 text-white" />
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">My Orders</h4>
                                        <p className="text-gray-600 text-sm">View and track all your orders</p>
                                    </Link>

                                    {/* Change Password */}
                                    <Link 
                                        to="/password/update" 
                                        className="group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl p-6 border-2 border-purple-200 hover:border-pink-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Lock className="w-7 h-7 text-white" />
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Change Password</h4>
                                        <p className="text-gray-600 text-sm">Update your security credentials</p>
                                    </Link>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                        backgroundSize: '32px 32px'
                                    }} />
                                </div>

                                <div className="relative flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Account Security</h4>
                                        <p className="text-white/90 leading-relaxed">
                                            Your account is protected with industry-standard security measures. 
                                            We recommend changing your password regularly and enabling two-factor 
                                            authentication for enhanced security.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
