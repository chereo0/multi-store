import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getCategories, getStores } from '../../api/services';
import CategoryCard from '../../components/CategoryCard';

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  // category hover no longer used after refactor
  const [hoveredStore, setHoveredStore] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResult, storesResult] = await Promise.all([
          getCategories(),
          getStores()
        ]);

        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }

        if (storesResult.success) {
          setStores(storesResult.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        // Trigger animations after data loads
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary mx-auto mb-4"></div>
          <div className="animate-pulse text-text text-xl font-semibold">Loading Amazing Stores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Animated Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-primary">
                Multi-Seller
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-muted animate-fade-in">Hello, {user.isGuest ? 'Guest' : user.name}</span>
                  <Link
                    to="/cart"
                    className="relative bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="animate-pulse">🛒</span> Cart ({getCartItemsCount()})
                  </Link>
                  {user.isGuest ? (
                    <>
                      <Link
                        to="/login"
                        className="text-muted hover:text-primary transform hover:scale-110 transition-all duration-200 font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="text-muted hover:text-text transform hover:scale-110 transition-all duration-200"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-muted hover:text-primary transform hover:scale-110 transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/cart"
                    className="relative bg-muted text-white px-6 py-2 rounded-full hover:bg-text transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="animate-pulse">🛒</span> Cart ({getCartItemsCount()})
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Animated Hero Section */}
      <section className="relative bg-primary text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-6xl font-extrabold mb-6 animate-pulse">
              🛍️ Discover Amazing Stores
            </h2>
            <p className="text-2xl mb-8 animate-fade-in delay-500">
              Shop from multiple verified sellers in one place
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce">
                🚀 Start Shopping
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transform hover:scale-110 transition-all duration-300 animate-bounce delay-200">
                📱 Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-4xl font-bold text-text mb-4 text-center">
              🎯 Shop by Category
            </h3>
            <p className="text-xl text-muted mb-12 text-center">
              Find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`transform transition-all duration-500 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stores Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-4xl font-bold text-text mb-4 text-center">
              ⭐ Featured Stores
            </h3>
            <p className="text-xl text-muted mb-12 text-center">
              Handpicked stores with amazing products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <div
                key={store.id}
                className={`transform transition-all duration-500 delay-${index * 150} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                onMouseEnter={() => setHoveredStore(store.id)}
                onMouseLeave={() => setHoveredStore(null)}
              >
                <Link
                  to={`/store/${store.id}`}
                  className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={store.banner}
                      alt={store.name}
                      className={`w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 ${hoveredStore === store.id ? 'brightness-110' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    
                    {/* Store Logo with Animation */}
                    <div className="absolute top-4 left-4 transform transition-all duration-300 group-hover:scale-110">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                    
                    {/* Verified Badge with Animation */}
                    {store.isVerified && (
                      <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-110">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          ✅ Verified
                        </span>
                      </div>
                    )}
                    
                    {/* Hover Overlay Content */}
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Click to explore</span>
                        <span className="text-2xl">🚀</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors duration-300">
                      {store.name}
                    </h4>
                    <p className="text-muted mb-4 line-clamp-2">{store.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 transition-all duration-300 ${
                                i < Math.floor(store.rating)
                                  ? 'text-yellow-400 animate-pulse'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-muted font-medium">
                          {store.rating} ({store.reviewCount} reviews)
                        </span>
                      </div>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                        {store.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '1000+', label: 'Happy Customers', icon: '😊' },
              { number: '50+', label: 'Verified Stores', icon: '🏪' },
              { number: '10K+', label: 'Products Available', icon: '📦' },
              { number: '99%', label: 'Satisfaction Rate', icon: '⭐' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 delay-${index * 200} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                  <div className="text-4xl mb-4 animate-bounce">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2 animate-pulse">{stat.number}</div>
                  <div className="text-lg font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Footer */}
      <footer className="bg-text text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h4 className="text-2xl font-bold mb-4 animate-pulse">🌟 Multi-Seller Platform</h4>
            <p className="text-muted mb-6">Your one-stop destination for amazing products from verified sellers</p>
            <div className="flex justify-center space-x-6 text-2xl">
              <span className="hover:text-secondary cursor-pointer transform hover:scale-125 transition-all duration-300">📱</span>
              <span className="hover:text-secondary cursor-pointer transform hover:scale-125 transition-all duration-300">💬</span>
              <span className="hover:text-secondary cursor-pointer transform hover:scale-125 transition-all duration-300">📧</span>
              <span className="hover:text-secondary cursor-pointer transform hover:scale-125 transition-all duration-300">🌐</span>
            </div>
            <p className="mt-6 text-muted">&copy; 2024 Multi-Seller. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;