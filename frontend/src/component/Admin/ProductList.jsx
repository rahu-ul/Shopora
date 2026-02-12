// src/components/Admin/ProductList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Edit3,
    Trash2,
    Search,
    Filter,
    RefreshCw,
    AlertCircle,
    DollarSign,
    Box,
    TrendingUp,
    Sparkles,
    Plus,
    Grid3x3,
    List,
    Eye,
    Tag,
    Image as ImageIcon,
    ArrowUpRight,
    LayoutGrid
} from 'lucide-react';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products`, {
                withCredentials: true
            });
            setProducts(data.product || data.products || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (productId, productName) => {
        toast(
            ({ closeToast }) => (
                <div className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Delete Product?</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{productName || 'this product'}</span>? This action cannot be undone.
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
                                    setDeletingId(productId);
                                    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products/${productId}`, {
                                        withCredentials: true
                                    });
                                    setProducts((prev) => prev.filter((p) => p._id !== productId));
                                    toast.success('Product deleted successfully');
                                    closeToast();
                                } catch (err) {
                                    toast.error(err.response?.data?.message || 'Failed to delete product');
                                    closeToast();
                                } finally {
                                    setDeletingId(null);
                                }
                            }}
                        >
                            Delete Product
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeButton: false }
        );
    };

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product._id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
        
        return matchesSearch && matchesCategory;
    });

    // Calculate stats
    const stats = {
        total: products.length,
        inStock: products.filter(p => p.Stock > 0).length,
        outOfStock: products.filter(p => p.Stock === 0).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.Stock || 0), 0)
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
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                                    Product Inventory
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">Manage your product catalog</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchProducts}
                                className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                            >
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                Refresh
                            </button>
                            <button
                                onClick={() => navigate('/admin/dashboard/products/new')}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Products</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                                    <Box className="w-6 h-6 text-white" />
                                </div>
                                <Sparkles className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">In Stock</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.inStock}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl">
                                    <AlertCircle className="w-6 h-6 text-white" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-red-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Out of Stock</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.outOfStock}</p>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Inventory Value</p>
                            <p className="text-3xl font-extrabold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Search, Filter and View Toggle Bar */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by product name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-12 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer min-w-[200px]"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-300 ${
                                    viewMode === 'grid' 
                                        ? 'bg-white text-blue-600 shadow-md' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all duration-300 ${
                                    viewMode === 'table' 
                                        ? 'bg-white text-blue-600 shadow-md' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="Table View"
                            >
                                <List className="w-5 h-5" />
                            </button>
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
                            <p className="text-gray-600 font-medium">Loading products...</p>
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
                                        <h3 className="text-2xl font-bold mb-1">Error Loading Products</h3>
                                        <p className="text-red-100">{error}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <button 
                                    onClick={fetchProducts}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                            <div
                                key={product._id}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-2"
                                style={{
                                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                                }}
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                    <img
                                        src={product.image?.[0]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            product.Stock > 0 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-red-500 text-white'
                                        }`}>
                                            {product.Stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm text-gray-600">{product.category || 'Uncategorized'}</span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            <Box className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-semibold text-gray-700">{product.Stock}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/product/${product._id}`)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id, product.name)}
                                            disabled={deletingId === product._id}
                                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                                        >
                                            {deletingId === product._id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16">
                                <div className="p-6 bg-gray-100 rounded-full mb-4">
                                    <Package className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filterCategory !== 'All' 
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Start by adding your first product'}
                                </p>
                                <button
                                    onClick={() => navigate('/admin/dashboard/products/new')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Product
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                        <th className="py-5 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="py-5 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                                        <tr 
                                            key={product._id} 
                                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300"
                                            style={{
                                                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                                            }}
                                        >
                                            {/* Product */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <img
                                                            src={product.image?.[0]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/64'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-lg">{product.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono mt-0.5">#{product._id?.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-5 px-6 text-center">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                    <Tag className="w-3 h-3" />
                                                    {product.category || 'N/A'}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-5 px-6 text-center">
                                                <div className="inline-flex items-center gap-1 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="font-bold text-green-900">₹{product.price}</span>
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="py-5 px-6 text-center">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
                                                    product.Stock > 0 
                                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    <Box className="w-4 h-4" />
                                                    {product.Stock}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/product/${product._id}`)}
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        disabled={deletingId === product._id}
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                                                    >
                                                        {deletingId === product._id ? (
                                                            <>
                                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-6 bg-gray-100 rounded-full mb-4">
                                                        <Package className="w-16 h-16 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                                                    <p className="text-gray-500 mb-6">
                                                        {searchTerm || filterCategory !== 'All' 
                                                            ? 'Try adjusting your search or filter criteria'
                                                            : 'Start by adding your first product'}
                                                    </p>
                                                    <button
                                                        onClick={() => navigate('/admin/dashboard/products/new')}
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                        Add Product
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        {filteredProducts.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{products.length}</span> products
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

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default ProductList;
