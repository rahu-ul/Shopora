// src/pages/ConfirmOrder.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../component/Cart/CheckoutSteps';

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const { shippingInfo, cartItems } = useSelector(state => state.cart);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18; // ✅ GST 18% (agar aapke backend me bhi hai)
  const totalPrice = subtotal + shippingCharges + tax;

  const handleProceedToPayment = () => {
    const orderInfo = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo)); // ✅ Save before navigate
    navigate('/payment');
  };

  return (
    <>
      <CheckoutSteps activeStep={1} />
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold border-b pb-2">Shipping Info</h2>
              <div className="mt-4 space-y-2">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Address:</strong> {shippingInfo?.address}, {shippingInfo?.city} - {shippingInfo?.pinCode}</p>
                <p><strong>Phone:</strong> {shippingInfo?.phoneNo}</p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-2xl font-bold border-b pb-2">Your Cart Items</h2>
              <div className="mt-4 space-y-4">
                {cartItems.map(item => (
                  <div key={item.product} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <Link to={`/product/${item.product}`} className="text-lg font-semibold">{item.name}</Link>
                    </div>
                    <span className="text-gray-600">
                      {item.quantity} x ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold border-b pb-2">Order Summary</h2>
              <div className="mt-4 space-y-2 text-lg">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span>₹{shippingCharges.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST (18%):</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t pt-2"><span>Total:</span><span>₹{totalPrice.toFixed(2)}</span></div>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg font-semibold"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
