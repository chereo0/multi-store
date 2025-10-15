import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/home');
  };

  const navigationLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Snoes', href: '/categories' },
    { name: 'Hont', href: '/stores' },
    { name: 'Aclumt', href: '/about' },
  ];

  return (
    <>
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="px-8 lg:px-16 h-20 flex items-center justify-between">
          {/* Logo */}
          <Logo className="w-12 h-12" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 font-medium text-base hover:text-cyan-500 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              🛒 Cart ({getCartItemsCount()})
            </Link>

            {/* Auth Buttons */}
            {user && !user.isGuest ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-cyan-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-cyan-500 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-cyan-500 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-8 py-4 space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-700 hover:text-cyan-500 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;
