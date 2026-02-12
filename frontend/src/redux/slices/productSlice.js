// src/redux/slices/productSlice.jsx

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Public products ke liye action
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { keyword = '', currentPage = 1, price = [0, 1000000], category = '', ratings = 0, limit } = params;

      const query = new URLSearchParams({
        keyword,
        page: String(currentPage),
        'price[gte]': String(price[0]),
        'price[lte]': String(price[1]),
        'ratings[gte]': String(ratings),
      });

      if (category) query.append('category', category);
      if (limit) query.append('limit', String(limit));

      const link = `${import.meta.env.VITE_API_BASE_URL}/api/v1/products?${query.toString()}`;
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Product details ke liye naya action
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  products: [],
  product: {}, // Product details ke liye naya state
  loading: false,
  error: null,
  productsCount: 0,
  resultPerPage: 4,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Public products ke liye cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Redux fulfilled - payload:', action.payload);
        // Extract products from the API response
        state.products = action.payload.product;
        state.productsCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        console.log('Redux state updated:', { 
          products: state.products, 
          productsCount: state.productsCount, 
          resultPerPage: state.resultPerPage 
        });
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Product details ke liye naye cases
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product; // details ko 'product' state mein save karein
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = productSlice.actions;

export default productSlice.reducer;
