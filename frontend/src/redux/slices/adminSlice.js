// src/redux/slices/adminSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get admin products data
export const getAdminProducts = createAsyncThunk(
    'admin/getAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/products`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get admin users data
export const getAdminUsers = createAsyncThunk(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/getAdminUsers`,
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/admin/users');
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get admin orders data
export const getAdminOrders = createAsyncThunk(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/getAdminOrders`,
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/orders');
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const initialState = {
    products: [],
    users: [],
    orders: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Admin Products
            .addCase(getAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(getAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Admin Users
            .addCase(getAdminUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Admin Orders
            .addCase(getAdminOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearErrors } = adminSlice.actions;

export default adminSlice.reducer;