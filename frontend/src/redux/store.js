import {configureStore} from '@reduxjs/toolkit';
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {    
    products : productReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
  }
});

export default store;