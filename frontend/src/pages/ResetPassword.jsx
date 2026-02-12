// src/pages/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { clearErrors, resetPassword } from '../redux/slices/userSlice';
import Loading from '../component/common/Loading';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // URL se token nikalne ke liye
    const { error, loading, success } = useSelector(state => state.user);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const myForm = new FormData();
        myForm.set('password', password);
        myForm.set('confirmPassword', confirmPassword);
        
        dispatch(resetPassword({ token, passwords: { password, confirmPassword } }));
    };

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
        if (success) {
            alert('Password Reset Successfully');
            navigate('/login');
        }
    }, [dispatch, error, success, navigate]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
                    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="relative">
                                <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResetPassword;