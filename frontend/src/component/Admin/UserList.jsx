// src/components/Admin/UserList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Users,
    User,
    Mail,
    Shield,
    UserCog,
    Trash2,
    Edit3,
    Search,
    Filter,
    RefreshCw,
    AlertCircle,
    Crown,
    UserCheck,
    TrendingUp,
    Sparkles,
    ArrowUpRight,
    Calendar,
    MoreVertical,
    Check,
    X
} from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/users`, {
                withCredentials: true
            });
            setUsers(data.users || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (userId, userName) => {
        toast(
            ({ closeToast }) => (
                <div className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Delete User?</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{userName || 'this user'}</span>? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                        <button
                            className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                            onClick={closeToast}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={async () => {
                                try {
                                    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/user/${userId}`, {
                                        withCredentials: true
                                    });
                                    setUsers(prev => prev.filter(u => u._id !== userId));
                                    toast.success('User deleted successfully');
                                    closeToast();
                                } catch (err) {
                                    toast.error(err.response?.data?.message || 'Failed to delete user');
                                    closeToast();
                                }
                            }}
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeButton: false }
        );
    };

    const handleToggleRole = (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        toast(
            ({ closeToast }) => (
                <div className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <UserCog className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Change User Role?</h3>
                            <p className="text-sm text-gray-600">
                                Change role of <span className="font-semibold text-gray-900">{user.name || 'this user'}</span> to{' '}
                                <span className={`font-semibold ${newRole === 'admin' ? 'text-purple-600' : 'text-green-600'}`}>
                                    {newRole}
                                </span>?
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                        <button
                            className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                            onClick={closeToast}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={async () => {
                                try {
                                    const payload = {
                                        name: user.name,
                                        email: user.email,
                                        role: newRole
                                    };
                                    const { data } = await axios.put(
                                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/user/${user._id}`,
                                        payload,
                                        { withCredentials: true }
                                    );
                                    const updated = data.user || { ...user, role: newRole };
                                    setUsers(prev => prev.map(u => (u._id === user._id ? updated : u)));
                                    toast.success('Role updated successfully');
                                    closeToast();
                                } catch (err) {
                                    toast.error(err.response?.data?.message || 'Failed to update role');
                                    closeToast();
                                }
                            }}
                        >
                            Confirm Change
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeButton: false }
        );
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user._id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'All' || user.role === filterRole.toLowerCase();
        
        return matchesSearch && matchesRole;
    });

    // Calculate stats
    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'user').length,
        active: users.length // Assuming all are active for now
    };

    // Get user initials
    const getUserInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get avatar color based on name
    const getAvatarColor = (name) => {
        if (!name) return 'from-gray-400 to-gray-500';
        const colors = [
            'from-blue-400 to-blue-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-green-400 to-green-600',
            'from-yellow-400 to-yellow-600',
            'from-red-400 to-red-600',
            'from-indigo-400 to-indigo-600',
            'from-cyan-400 to-cyan-600',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative p-8">
                {/* Header Section */}
                <div className="mb-8 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                                    User Management
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">Manage user accounts and permissions</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={fetchUsers}
                            className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Users</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                                <Shield className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Administrators</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.admins}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                                    <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Regular Users</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.users}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <Calendar className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Active Users</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.active}</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="pl-12 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer min-w-[200px]"
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Administrators</option>
                                <option value="User">Regular Users</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 animate-spin">
                                <RefreshCw className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-gray-600 font-medium">Loading users...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <AlertCircle className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">Error Loading Users</h3>
                                        <p className="text-red-100">{error}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <button 
                                    onClick={fetchUsers}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                        <th className="py-5 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="py-5 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            User ID
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                                        <tr 
                                            key={user._id} 
                                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300 group"
                                            style={{
                                                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                                            }}
                                        >
                                            {/* User Info */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`relative w-12 h-12 bg-gradient-to-br ${getAvatarColor(user.name)} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                        <span className="text-white font-bold text-lg">
                                                            {getUserInitials(user.name)}
                                                        </span>
                                                        {user.role === 'admin' && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                <Crown className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            Joined {new Date().toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <Mail className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm text-gray-700">{user.email}</span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="py-5 px-6 text-center">
                                                <div className="flex justify-center">
                                                    {user.role === 'admin' ? (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-2 border-purple-200">
                                                            <Crown className="w-4 h-4" />
                                                            Administrator
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200">
                                                            <User className="w-4 h-4" />
                                                            User
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* User ID */}
                                            <td className="py-5 px-6 text-center">
                                                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                                    <span className="text-xs font-mono font-semibold text-gray-700">
                                                        #{user._id?.slice(-6).toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleRole(user)}
                                                        className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                                        title="Change Role"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit Role
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-6 bg-gray-100 rounded-full mb-4">
                                                        <Users className="w-16 h-16 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
                                                    <p className="text-gray-500">
                                                        {searchTerm || filterRole !== 'All' 
                                                            ? 'Try adjusting your search or filter criteria'
                                                            : 'No users are registered yet'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        {filteredUsers.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{users.length}</span> users
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(40px, -60px) scale(1.15);
                    }
                    66% {
                        transform: translate(-30px, 30px) scale(0.9);
                    }
                }

                .animate-blob {
                    animation: blob 8s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UserList;
