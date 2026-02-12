import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/${id}`);
                const product = data.product;
                setName(product?.name || '');
                setPrice(product?.price || 0);
                setDescription(product?.description || '');
                setCategory(product?.category || '');
                setStock(product?.Stock ?? 0);
                const existingImages = product?.image || product?.images || [];
                setImagesPreview(existingImages.map(img => img.url));
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setImagesPreview(files.map((file) => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            let data;
            if (images.length > 0) {
                const productData = new FormData();
                productData.set('name', name);
                productData.set('price', price);
                productData.set('description', description);
                productData.set('category', category);
                productData.set('stock', stock);
                images.forEach((imageFile) => {
                    productData.append('images', imageFile);
                });

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                };

                const response = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products/${id}`,
                    productData,
                    config
                );
                data = response.data;
            } else {
                const payload = {
                    name,
                    price,
                    description,
                    category,
                    stock
                };
                const response = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products/${id}`,
                    payload,
                    { withCredentials: true }
                );
                data = response.data;
            }

            if (data?.success) {
                toast.success('Product updated');
                setTimeout(() => {
                    navigate('/admin/dashboard/products');
                }, 800);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-8">Update Product</h1>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-gray-700">Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full mt-1 p-2 border rounded-md" required></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Stock</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Replace Images</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} multiple className="w-full mt-1 p-2 border rounded-md" />
                    <div className="flex flex-wrap mt-2">
                        {imagesPreview.map((img, index) => (
                            <img key={index} src={img} alt="Product Preview" className="w-20 h-20 object-cover rounded-md m-1" />
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {saving ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
