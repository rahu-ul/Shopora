// src/components/Cart/CheckoutSteps.jsx

import React from 'react';
import { FaTruck, FaCheckCircle, FaCreditCard } from 'react-icons/fa';

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    { label: 'Shipping Details', icon: <FaTruck /> },
    { label: 'Confirm Order', icon: <FaCheckCircle /> },
    { label: 'Payment', icon: <FaCreditCard /> },
  ];

  return (
    <div className="flex justify-between items-center w-full max-w-xl mx-auto my-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center text-center">
          <div className={`p-4 rounded-full border-4 ${index <= activeStep ? 'border-blue-500' : 'border-gray-300'}`}>
            <span className={`text-2xl ${index <= activeStep ? 'text-blue-500' : 'text-gray-400'}`}>
              {step.icon}
            </span>
          </div>
          <p className={`mt-2 font-semibold ${index <= activeStep ? 'text-blue-500' : 'text-gray-400'} hidden md:block ml-2`}>
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;