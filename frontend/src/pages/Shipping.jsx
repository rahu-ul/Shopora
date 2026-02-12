// src/pages/Shipping.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../component/Cart/CheckoutSteps';
import { saveShippingInfo } from '../redux/slices/cartSlice';

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const handleShippingSubmit = (e) => {
    e.preventDefault();

    // ✅ Backend schema ke according sab fields save karna zaroori hai
    dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }));

    navigate('/order/confirm');
  };

  return (
    <>
      <CheckoutSteps activeStep={0} />
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">Shipping Details</h2>
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="State"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Pin Code"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
