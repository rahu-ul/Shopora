// src/redux/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  shippingInfo: {},
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(i => i.product === item.product);

      if (existingItem) {
        // If item already exists, update quantity
        existingItem.quantity = Math.min(existingItem.quantity + item.quantity, existingItem.stock);
      } else {
        // Add new item to cart
        state.cartItems.push(item);
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.product !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    // Update item quantity
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(i => i.product === productId);
      
      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    // Increase quantity
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(i => i.product === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    // Decrease quantity
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(i => i.product === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },

    // Calculate totals (helper function)
    calculateTotals: (state) => {
      state.totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Save shipping info
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  saveShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;