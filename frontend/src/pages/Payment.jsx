// src/pages/Payment.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutSteps from "../component/Cart/CheckoutSteps";
import axios from "axios";
import { createOrder } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";

// Use direct backend URL
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const CheckoutForm = ({ orderInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/payment/process`, // ✅ ab backend pe jayega
        { amount: Math.round(orderInfo.totalPrice * 100) },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const client_secret = data.client_secret;
      const cardElement = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || "Guest",
            email: user?.email || "test@example.com",
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              postal_code: shippingInfo.pinCode,
            },
          },
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const orderData = {
          shippingInfo,
          orderItems: cartItems,
          itemsPrice: orderInfo.subtotal,
          taxPrice: orderInfo.tax,
          shippingPrice: orderInfo.shippingCharges,
          totalPrice: orderInfo.totalPrice,
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
        };

        await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        sessionStorage.removeItem("orderInfo");
        navigate("/success");
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="mb-4">
        <label className="block text-gray-700">Card Number</label>
        <CardNumberElement className="px-4 py-3 border rounded-lg" />
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label className="block text-gray-700">Expiry Date</label>
          <CardExpiryElement className="px-4 py-3 border rounded-lg" />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700">CVC</label>
          <CardCvcElement className="px-4 py-3 border rounded-lg" />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay - ₹${orderInfo.totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const [stripeApiKey, setStripeApiKey] = useState(null);
  const [stripeInitError, setStripeInitError] = useState("");

  useEffect(() => {
    if (!orderInfo) {
      navigate("/order/confirm");
      return;
    }

    async function getStripeApiKey() {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/stripeapikey`, // ✅ yaha bhi backend se call hoga
          { withCredentials: true }
        );
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        setStripeInitError(
          error.response?.data?.message ||
            error.message ||
            "Failed to initialize Stripe"
        );
      }
    }
    getStripeApiKey();
  }, [orderInfo, navigate]);

  // ✅ useMemo se ek stable stripePromise banega
  const stripePromise = useMemo(() => {
    return stripeApiKey ? loadStripe(stripeApiKey) : null;
  }, [stripeApiKey]);

  if (stripeInitError) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-red-600 font-medium">{stripeInitError}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please login and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return <div>Loading Payment Gateway...</div>;
  }

  return (
    <>
      <CheckoutSteps activeStep={2} />
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Card Info</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm orderInfo={orderInfo} />
          </Elements>
        </div>
      </div>
    </>
  );
};

export default Payment;
