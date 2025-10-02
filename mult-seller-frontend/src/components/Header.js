import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);


  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/home');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link 
            to="/home" 
            className="text-2xl font-bold transition-colors duration-300 hover:opacity-80"
            style={{ color: '#111827' }}
          >
            Multi-Seller
          </Link>
          
          <nav className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative px-4 py-2 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  🛒 Cart ({getCartItemsCount()})
                </Link>


                {user.isGuest ? (
                  <>
                    <Link
                      to="/login"
                      className="font-medium transition-colors duration-300 hover:opacity-80"
                      style={{ color: '#6B7280' }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ backgroundColor: '#F59E0B' }}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  /* User Profile Dropdown */
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Profile button clicked, current state:', showProfileMenu);
                        setShowProfileMenu(!showProfileMenu);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-lg"
                      style={{ backgroundColor: 'white', border: '2px solid #3B82F6' }}
                    >
                      <img
                        src={user.avatar || 'https://via.placeholder.com/40'}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-sm" style={{ color: '#111827' }}>
                          {user.name || `${user.firstname} ${user.lastname}`}
                        </div>
                        <div className="text-xs" style={{ color: '#6B7280' }}>
                          {user.email}
                        </div>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}
                        style={{ color: '#3B82F6' }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <div 
                        className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                        style={{ backgroundColor: 'white', zIndex: 60 }}
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || 'https://via.placeholder.com/50'}
                              alt="Profile"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold" style={{ color: '#111827' }}>
                                {user.name || `${user.firstname} ${user.lastname}`}
                              </div>
                              <div className="text-sm" style={{ color: '#6B7280' }}>
                                @{user.username}
                              </div>
                              <div className="text-xs" style={{ color: '#6B7280' }}>
                                {user.email}
                              </div>
                              {user.telephone && (
                                <div className="text-xs" style={{ color: '#6B7280' }}>
                                  📞 {user.telephone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Main logout button clicked');
                              handleLogout();
                            }}
                            className="w-full text-left px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-red-50 flex items-center space-x-2"
                            style={{ color: '#DC2626' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Logout</span>
                          </button>
                          
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium transition-colors duration-300 hover:opacity-80"
                  style={{ color: '#6B7280' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Sign Up
                </Link>
                <Link
                  to="/cart"
                  className="relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#6B7280', color: 'white' }}
                >
                  🛒 Cart ({getCartItemsCount()})
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
      
      {/* Overlay to close dropdown */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0" 
          style={{ zIndex: 50 }}
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;

