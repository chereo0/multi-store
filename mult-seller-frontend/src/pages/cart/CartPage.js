import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { submitOrder } from '../../api/services';

const CartPage = () => {
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentLocation: '',
    preferredDeliveryTime: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [stars, setStars] = useState([]);

  const { isGuest } = useAuth();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsByStore 
  } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Generate starfield for dark mode
  useEffect(() => {
    if (isDarkMode) {
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 2 + 1
      }));
      setStars(newStars);
    }
  }, [isDarkMode]);

  const handleInputChange = (e) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (isGuest) {
      navigate('/signup');
      return;
    }
    setLoading(true);

    try {
      const orderData = {
        ...checkoutData,
        items: cartItems,
        total: getCartTotal()
      };

      const result = await submitOrder(orderData);
      
      if (result.success) {
        setOrderDetails(result.data);
        setOrderSubmitted(true);
        clearCart();
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cartItemsByStore = getCartItemsByStore();

  // Order success page
  if (orderSubmitted) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : ''
        }`}
        style={!isDarkMode ? {
          backgroundImage: 'url(/white%20backgroud.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } : {}}
      >
        <div className={`max-w-md w-full rounded-2xl p-8 text-center backdrop-blur-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20' 
            : 'bg-white/90 border border-gray-200 shadow-xl'
        }`}>
          <div className="mb-6">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
              isDarkMode ? 'bg-green-500/20 border border-green-400' : 'bg-green-100'
            }`}>
              <svg className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Order Placed Successfully!</h2>
          <p className={`mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your order #{orderDetails.orderId} has been placed successfully.
          </p>
          <p className={`mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {orderDetails.message}
          </p>
          <p className={`text-sm mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Estimated delivery: {orderDetails.estimatedDelivery}
          </p>
          <div className="space-y-3">
            <Link
              to="/home"
              className={`w-full px-4 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/25' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
              }`}
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => {
                setOrderSubmitted(false);
                setOrderDetails(null);
              }}
              className={`w-full px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart page
  if (cartItems.length === 0) {
    return (
      <div 
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : ''
        }`}
        style={!isDarkMode ? {
          backgroundImage: 'url(/white%20backgroud.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } : {}}
      >
        {/* Starfield for dark mode */}
        {isDarkMode && (
          <div className="fixed inset-0 pointer-events-none">
            {stars.map(star => (
              <div
                key={star.id}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDuration: `${star.twinkle}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Spacer for fixed navbar */}
        <div className="h-16"></div>

        {/* Empty Cart Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className={`mb-8 p-8 rounded-2xl backdrop-blur-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10' 
                : 'bg-white/80 border border-gray-200 shadow-xl'
            }`}>
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <svg className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Your Cosmic Cart is Empty</h2>
              <p className={`text-lg mb-8 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Start your quantum shopping journey to add items to your cart</p>
            <Link
              to="/home"
                className={`inline-block px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/25' 
                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                }`}
              >
                Explore the Multiverse
            </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : ''
      }`}
      style={!isDarkMode ? {
        backgroundImage: 'url(/white%20backgroud.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* Starfield for dark mode */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none">
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDuration: `${star.twinkle}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            YOUR COSMIC CART
          </h1>
          <div className={`w-32 h-1 mx-auto rounded-full ${
            isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-gradient-to-r from-cyan-500 to-purple-600'
          }`}></div>
        </div>

        {!showCheckout ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details Section */}
            <div className={`rounded-2xl p-6 backdrop-blur-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10' 
                : 'bg-white/80 border border-gray-200 shadow-xl'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ORDER DETAILS
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(cartItemsByStore).map(([storeId, items]) =>
                  items.map((item) => (
                    <div 
                      key={`${item.product.id}-${item.storeId}`} 
                      className={`rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border border-gray-600/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/20' 
                          : 'bg-gray-50 border border-gray-200 hover:border-cyan-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-16 h-16 rounded-lg overflow-hidden ${
                          isDarkMode ? 'ring-2 ring-cyan-400/50' : 'ring-2 ring-cyan-300/50'
                        }`}>
                        <img
                          src={
                            item.product.image ||
                            item.product.image_url ||
                            item.product.picture ||
                            item.product.raw?.image ||
                            '/no-image.png'
                          }
                          alt={item.product.name}
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.product.name.toUpperCase()}
                          </h3>
                          <p className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Quantum Enhanced Product
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.storeId, item.quantity - 1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                              isDarkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-semibold transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.storeId, item.quantity + 1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                              isDarkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold transition-colors duration-300 ${
                            isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                          }`}>
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.storeId)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white ${
                              isDarkMode 
                                ? 'bg-gray-600 text-gray-300' 
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                  </div>
                  ))
                )}
                </div>
            </div>

            {/* Order Summary Section */}
            <div className={`rounded-2xl p-6 backdrop-blur-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10' 
                : 'bg-white/80 border border-gray-200 shadow-xl'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ORDER SUMMARY
              </h2>
              
              <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Subtotal:</span>
                  <span className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Shipping:</span>
                  <span className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Tax:</span>
                  <span className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>$0.00</span>
                  </div>
                <div className={`h-px ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                  <div className="flex justify-between">
                  <span className={`text-xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>TOTAL:</span>
                  <span className={`text-xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              
                <button
                  onClick={() => {
                    if (isGuest) {
                      navigate('/signup');
                    } else {
                      setShowCheckout(true);
                    }
                  }}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40' 
                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                PROCEED TO CHECKOUT
                </button>
              
                <Link
                  to="/home"
                className={`block w-full text-center mt-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-cyan-400 hover:text-cyan-300' 
                    : 'text-cyan-600 hover:text-cyan-500'
                }`}
                >
                  Continue Shopping
                </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="max-w-2xl mx-auto">
            <div className={`rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10' 
                : 'bg-white/80 border border-gray-200 shadow-xl'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Quantum Checkout</h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={checkoutData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={checkoutData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={checkoutData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="currentLocation" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Current Location *
                  </label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    required
                    value={checkoutData.currentLocation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your current location"
                  />
                </div>

                <div>
                  <label htmlFor="preferredDeliveryTime" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Preferred Delivery Time
                  </label>
                  <select
                    id="preferredDeliveryTime"
                    name="preferredDeliveryTime"
                    value={checkoutData.preferredDeliveryTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                        : 'bg-white border border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500/20'
                    } focus:outline-none focus:ring-2`}
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                <div className={`p-4 rounded-lg transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <h3 className={`font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Items ({cartItems.length})</span>
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Shipping</span>
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Total</span>
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/25' 
                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                    }`}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;