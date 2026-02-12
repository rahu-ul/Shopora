// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../redux/slices/userSlice';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useSelector((state) => state.user);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email: loginEmail, password: loginPassword }));
    };

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/Home'); // Login hone par home page par redirect karein
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email/Username Field */}
                    <div className="relative">
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Password Field */}
                    <div className="relative">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Forgot Password Link */}
                    <div className="text-right text-sm">
                        <Link to="/password/forgot" className="text-blue-500 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        disabled={loading} // <-- Loading state
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    
                    {/* Register Link */}
                    <div className="text-center text-sm mt-4">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;