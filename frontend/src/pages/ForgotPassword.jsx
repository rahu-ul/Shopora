// src/pages/ForgotPassword.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope } from 'react-icons/fa';
import { clearErrors, forgotPassword } from '../redux/slices/userSlice';
import Loading from '../component/common/Loading';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { error, loading, message } = useSelector(state => state.user);

    const [email, setEmail] = useState('');

    const handleForgotPassword = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
        if (message) {
            alert(message);
        }
    }, [dispatch, error, message]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
                    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="relative">
                                <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForgotPassword;