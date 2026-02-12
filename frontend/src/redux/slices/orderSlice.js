// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Order create karne ke liye action
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/new`,
        order,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Logged-in user ke orders fetch karne ke liye action
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/orders/me`, {
        withCredentials: true,
      });
      return data; // <-- Tumne return bhul diya tha
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Order details fetch
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/${orderId}`, {
        withCredentials: true,
      });
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load order details");
    }
  }
);

// Cancel own order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
  }
);

// Request return for delivered order
export const requestReturn = createAsyncThunk(
  "order/requestReturn",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/${orderId}/return`,
        { reason },
        { withCredentials: true }
      );
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit return request");
    }
  }
);

const initialState = {
  loading: false,
  orders: [],
  order: null, // last created order
  selectedOrder: null, // viewed order details
  detailsLoading: false,
  actionLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    applySocketOrderUpdate: (state, action) => {
      const incomingOrder = action.payload;
      if (!incomingOrder || !incomingOrder._id) return;

      if (state.selectedOrder?._id === incomingOrder._id) {
        state.selectedOrder = incomingOrder;
      }

      state.orders = state.orders.map((o) =>
        o._id === incomingOrder._id ? { ...o, ...incomingOrder } : o
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.selectedOrder = null;
        state.error = action.payload;
      })

      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // requestReturn
      .addCase(requestReturn.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(requestReturn.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
        state.error = null;
      })
      .addCase(requestReturn.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearSelectedOrder, applySocketOrderUpdate } = orderSlice.actions;
export default orderSlice.reducer;
