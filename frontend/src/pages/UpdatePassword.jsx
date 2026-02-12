// src/pages/UpdatePassword.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaKey } from 'react-icons/fa';
import { clearErrors, updatePassword } from '../redux/slices/userSlice';
import Loading from '../component/common/Loading';

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading, isUpdated } = useSelector((state) => state.user);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('oldPassword', oldPassword);
        myForm.set('newPassword', newPassword);
        myForm.set('confirmPassword', confirmPassword);

        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert('Password Updated Successfully');
            navigate('/profile');
            dispatch({ type: 'updatePasswordReset' }); // Redux state reset
        }
    }, [dispatch, error, navigate, isUpdated]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
                    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-center mb-6">Change Password</h2>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {/* Old Password */}
                            <div className="relative">
                                <FaKey className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Confirm Password */}
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
                                {loading ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdatePassword;