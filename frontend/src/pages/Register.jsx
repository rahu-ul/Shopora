// src/pages/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearErrors } from '../redux/slices/userSlice';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = user;
    const [avatar, setAvatar] = useState(''); // <-- Photo file ke liye state
    const [avatarPreview, setAvatarPreview] = useState('https://ui-avatars.com/api/?name=User&background=random&rounded=true&size=64'); // <-- Preview image ke liye state

    const handleRegister = (e) => {
        e.preventDefault();
        
        // Yahan Redux action dispatch hoga
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('password', password);
        myForm.set('avatar', avatar);

        dispatch(registerUser(myForm));
    };

    const handleDataChange = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files && e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(reader.result);
                    }
                };
                reader.readAsDataURL(file);
                setAvatar(file); // <-- Send actual File object to backend
            }
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/Home');
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
                <form 
                    onSubmit={handleRegister} 
                    className="space-y-4"
                    encType="multipart/form-data" // <-- Zaroori hai
                >
                    {/* Name Field */}
                    <div className="relative">
                        <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            value={name}
                            onChange={handleDataChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Email Field */}
                    <div className="relative">
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={handleDataChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Password Field */}
                    <div className="relative">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={handleDataChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex items-center space-x-4 mt-4">
                        <img
                            src={avatarPreview} // <-- Preview dikhane ke liye
                            alt="Avatar Preview"
                            className="w-16 h-16 rounded-full object-cover border border-gray-300"
                        />
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleDataChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    {/* Login Link */}
                    <div className="text-center text-sm mt-4">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;