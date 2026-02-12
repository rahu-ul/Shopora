// src/pages/Products.jsx (Updated)

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, clearErrors } from '../redux/slices/productSlice';
import ProductCard from '../component/Product/ProductCard';
import Loading from '../component/common/Loading';
import FilterSidebar from '../component/FilterSidebar'; // <-- Import karein
import Pagination from '../component/Pagination'; // <-- Import karein
import axios from 'axios';


const Products = () => {
 const dispatch = useDispatch();
    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);

    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 1000000]); 
    const [category, setCategory] = useState('');
    const [ratings, setRatings] = useState(0);
    const [allCategories, setAllCategories] = useState([]);

    const categories = useMemo(() => {
        if (allCategories.length > 0) return allCategories;
        return Array.from(new Set((products || []).map((p) => p.category).filter(Boolean)));
    }, [allCategories, products]);

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
        // yahan 'params' object ko pass karein
        dispatch(fetchProducts({ keyword, currentPage, price, category, ratings }));
    }, [dispatch, error, keyword, currentPage, price, category, ratings]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/products/categories`);
                setAllCategories(data?.categories || []);
            } catch (err) {
                // Keep UI usable by falling back to categories from loaded products.
                setAllCategories([]);
            }
        };

        fetchCategories();
    }, []);

    const handleKeywordChange = (value) => {
        setKeyword(value);
        setCurrentPage(1);
    };

    const handlePriceChange = (nextPrice) => {
        setPrice(nextPrice);
        setCurrentPage(1);
    };

    const handleCategoryChange = (nextCategory) => {
        setCategory(nextCategory);
        setCurrentPage(1);
    };

    const handleRatingsChange = (nextRatings) => {
        setRatings(nextRatings);
        setCurrentPage(1);
    };

    // Debug logging
    useEffect(() => {
        console.log('Current Redux state:', { products, loading, error, productsCount, resultPerPage });
    }, [products, loading, error, productsCount, resultPerPage]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="bg-gray-100 min-h-screen">
                    <div className="container mx-auto p-4 md:p-8">
                        <div className="mb-8">
                            {/* Search Box */}
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={keyword}
                                className="w-full p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => handleKeywordChange(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Filter Sidebar */}
                            <FilterSidebar 
                                setPrice={handlePriceChange} 
                                price={price}
                                setCategory={handleCategoryChange}
                                category={category}
                                setRatings={handleRatingsChange}
                                ratings={ratings}
                                categories={categories}
                            />

                            {/* Product Grid */}
                            <div className="md:w-3/4">
                                <h2 className="text-2xl font-bold mb-6">Products</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products && Array.isArray(products) && products.length > 0 ? (
                                        products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8">
                                            <p className="text-gray-500 text-lg mb-2">No Products Found</p>
                                            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pagination */}
                                {productsCount > resultPerPage && (
                                    <Pagination
                                        productsCount={productsCount}
                                        resultPerPage={resultPerPage}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Products;
