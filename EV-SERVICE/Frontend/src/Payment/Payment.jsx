////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      fontFamily: "Arial, sans-serif",
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const total = cartItems.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!deliveryInfo.fullName.trim()) return "Full name is required";
    if (!deliveryInfo.phone.trim()) return "Phone number is required";
    if (!deliveryInfo.email.trim()) return "Email is required";
    if (!deliveryInfo.address.trim()) return "Delivery address is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedCartItems = cartItems.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      }));

      const response = await fetch(
        "http://localhost:5000/api/payments/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            deliveryInfo,
            cartItems: formattedCartItems,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: deliveryInfo.fullName,
              email: deliveryInfo.email,
              phone: deliveryInfo.phone,
              address: {
                line1: deliveryInfo.address,
              },
            },
          },
        });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent.status === "succeeded") {
        await clearCart();
        navigate("/payment-success");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError(err.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header
        darkMode={darkMode}
        handleDarkMode={() => setDarkMode(!darkMode)}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 px-5 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:w-2/5">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between border-b dark:border-gray-700 pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={`http://localhost:5000/${item.productId.images[0]}`}
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.productId.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {(item.productId.price * item.quantity).toFixed(0)}JD
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {total.toFixed(2)}JD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="lg:w-3/5">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={deliveryInfo.fullName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={deliveryInfo.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={deliveryInfo.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Delivery Address
                        </label>
                        <textarea
                          name="address"
                          value={deliveryInfo.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Payment Details
                      </h2>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <CardElement options={cardStyle} />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4 justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      disabled={!stripe || loading}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Complete Payment"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentForm;
