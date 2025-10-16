import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const headerRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/home');
  };

  useEffect(() => {
    // Theme toggle applies classes to root element
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.style.transition = 'background-color 500ms, color 500ms';
  }, [theme]);

  // GSAP: Header slide down on load and hide/show on scroll
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: -80, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
    );

    let lastScroll = 0;
    const onScroll = () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      if (current > lastScroll && current > 100) {
        // scrolling down -> hide
        gsap.to(el, { y: -90, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
      } else {
        // scrolling up -> show
        gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
      }
      lastScroll = current <= 0 ? 0 : current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <div className="flex items-center space-x-3">
            <Logo className="w-12 h-12" />
            {/* Small label for branding */}
            <span className="font-semibold text-lg text-cyan-500">Quantum</span>
          </div>

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

            {/* Theme toggle */}
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
              className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.1a1 1 0 0 1 0 2 7 7 0 1 0 7 7 1 1 0 1 1 2 0A9 9 0 1 1 12 3.1z"/></svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79L3.17 5.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 8h2v-3h-2v3zm7.04-2.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM20 11h3v-2h-3v2zM4.22 19.78l1.79-1.79L4.22 16.2 2.43 18l1.79 1.78zM12 6a6 6 0 100 12A6 6 0 0012 6z"/></svg>
              )}
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
