import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    DollarSign,
    FileText,
    Image as ImageIcon,
    Tag,
    Box,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Save,
    ArrowLeft,
    Layers
} from 'lucide-react';

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();

    const categories = [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports & Outdoors',
        'Toys & Games',
        'Beauty & Health',
        'Automotive',
        'Food & Beverages',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create a FormData object to send to the backend
        const productData = new FormData();
        productData.set('name', name);
        productData.set('price', price);
        productData.set('description', description);
        productData.set('category', category);
        productData.set('stock', stock);

        // Append each image to the FormData object
        images.forEach(image => {
            productData.append('images', image);
        });

        // Make the API call
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            };
           const { data } = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products/new`,
  productData,
  config
);


            if (data.success) {
                toast.success('Product created successfully!');
                setTimeout(() => {
                    navigate('/');
                }, 800);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Product creation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        setImages([]);
        setImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldImages) => [...oldImages, reader.result]);
                    setImages((oldImages) => [...oldImages, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            processFiles(files);
        }
    };

    const removeImage = (index) => {
        setImagesPreview(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8 animate-fadeIn">
                        <button
                            onClick={() => navigate(-1)}
                            className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Back</span>
                        </button>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                                    Create New Product
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">Add a new product to your inventory</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn animation-delay-200">
                        {/* Product Information Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-blue-600" />
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        Price *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Box className="w-4 h-4 text-orange-600" />
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-purple-600" />
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-indigo-600" />
                                        Description *
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                                        placeholder="Describe your product in detail..."
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Product Images Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
                                    <ImageIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
                            </div>

                            {/* Drag and Drop Zone */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                                    dragActive 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    multiple
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                                        <Upload className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Drop images here or click to upload
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Supports: JPG, PNG, GIF (Max 5MB each)
                                    </p>
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                                        <Upload className="w-5 h-5" />
                                        Choose Files
                                    </div>
                                </label>
                            </div>

                            {/* Image Previews */}
                            {imagesPreview.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-blue-600" />
                                        Preview ({imagesPreview.length} {imagesPreview.length === 1 ? 'image' : 'images'})
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {imagesPreview.map((img, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fadeIn"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Product Preview ${index + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg"
                                                    title="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                                        <p className="text-xs font-semibold text-gray-900">Image {index + 1}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating Product...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Helper Text */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 mb-2">Important Notes</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• All fields marked with * are required</li>
                                        <li>• Upload high-quality images for better product presentation</li>
                                        <li>• Make sure to set accurate stock quantities</li>
                                        <li>• Provide detailed product descriptions for better customer experience</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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

                .animation-delay-200 {
                    opacity: 0;
                    animation: fadeIn 0.6s ease-out 0.2s forwards;
                }

                .border-3 {
                    border-width: 3px;
                }
            `}</style>
        </div>
    );
};

export default CreateProduct;
