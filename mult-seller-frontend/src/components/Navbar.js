import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { isDarkMode, colors } = useTheme();
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/home' },
    { name: 'About Us', path: '/about' },
    { name: 'Stores', path: '/stores' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    // Make navbar static in the document flow so it appears consistently on all pages
    <nav className={`relative w-full backdrop-blur-md transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-b border-cyan-400/20' 
        : 'bg-white/95 border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isDarkMode ? 'text-cyan-400' : 'text-gray-900'
            }`}>Quantum</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative ${
                  isActive(item.path)
                    ? isDarkMode 
                      ? 'text-cyan-400' 
                      : 'text-cyan-600'
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400' 
                      : 'text-gray-700 hover:text-cyan-600'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                    isDarkMode ? 'bg-cyan-400' : 'bg-cyan-600'
                  }`} />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* Dropdown Menu */}
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 ${
                isDarkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-10 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-white' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </div>
                  </Link>
                  
                  <Link
                    to="/address"
                    className={`block px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-10 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-white' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Address</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Security/Lock */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}>
              <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Shopping Cart */}
            <Link 
              to="/cart" 
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode ? 'bg-cyan-500/20 border border-cyan-400' : 'bg-cyan-100 border border-cyan-300'
              }`}
            >
              <svg className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {getCartItemsCount() > 0 && (
                <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  isDarkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {user.isGuest ? 'Guest' : user.name}
                  </span>
                  {!user.isGuest && (
                    <button
                      onClick={handleLogout}
                      className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="px-2 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    isActive(item.path)
                      ? isDarkMode 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-cyan-100 text-cyan-600'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-cyan-400' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-cyan-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="space-y-2">
                    <div className={`px-3 py-2 text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {user.isGuest ? 'Guest User' : `Welcome, ${user.name}`}
                    </div>
                    {!user.isGuest && (
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white' 
                          : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
