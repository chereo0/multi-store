import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  // Consider authenticated only when a real user (not guest) and a token exist
  const isAuthenticated = !!(
    user &&
    !user.isGuest &&
    (user.token || localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token"))
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigationItems = [
    { name: "Home", path: "/home" },
    { name: "About Us", path: "/about" },
    { name: "Stores", path: "/stores" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = (searchQuery || "").trim();
    navigate(`/stores?q=${encodeURIComponent(q)}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:backdrop-saturate-150 transition-all duration-300 ${
        isDarkMode
          ? isScrolled
            ? "bg-gray-900/90 border-b border-cyan-400/20 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
            : "bg-gray-900/70 border-b border-cyan-400/20 shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
          : isScrolled
          ? "bg-white/95 supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
          : "bg-white/80 supports-[backdrop-filter]:bg-white/70 border-b border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      }`}
      role="navigation"
      aria-label="Primary"
    >
      {/* subtle gradient divider at the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span
              className={`font-bold text-xl transition-colors duration-300 ${
                isDarkMode ? "text-cyan-400" : "text-gray-900"
              }`}
            >
              Quantum
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`text-sm font-medium transition-colors duration-200 rounded-lg px-3 py-2 relative ${
                  isActive(item.path)
                    ? isDarkMode
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-cyan-700 bg-cyan-100"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700/60"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Search bar (desktop) */}
            <form onSubmit={onSearchSubmit} role="search" aria-label="Site search" className="ml-3">
              <div
                className={`flex items-center h-10 rounded-full px-3 border focus-within:ring-2 transition shadow-sm ${
                  isDarkMode
                    ? "bg-gray-800/70 border-gray-700 focus-within:ring-cyan-500/40"
                    : "bg-white/90 border-gray-300 focus-within:ring-cyan-500/30"
                }`}
              >
                <MagnifyingGlassIcon className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores..."
                  className={`w-48 lg:w-64 bg-transparent outline-none text-sm leading-none ${
                    isDarkMode ? "text-gray-200 placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
                  }`}
                  aria-label="Search stores"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={`ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full transition ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/60"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className={`ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition ${
                    isDarkMode
                      ? "bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30"
                      : "bg-cyan-600/10 text-cyan-700 hover:bg-cyan-600/20"
                  }`}
                  aria-label="Search"
                  title="Search"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile icon with dropdown (Profile, Address) */}
            {isAuthenticated && (
              <div className="relative group">
                <button
                  type="button"
                  title="Profile"
                  aria-label="Profile"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <UserCircleIcon className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  role="menu"
                >
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-10 ${
                        isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-white"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center space-x-3">
                        <UserCircleIcon className="w-5 h-5" />
                        <span>Profile</span>
                      </div>
                    </Link>

                    <Link
                      to="/orders"
                      className={`block px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-10 ${
                        isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-white"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5 21h14M7 13l2 8m6-8l-2 8"/></svg>
                        <span>Orders</span>
                      </div>
                    </Link>

                    <Link
                      to="/address"
                      className={`block px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-10 ${
                        isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-white"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="w-5 h-5" />
                        <span>Address</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Show only Logout when authenticated */}

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode
                  ? "bg-cyan-500/20"
                  : "bg-cyan-100"
              }`}
            >
              <ShoppingCartIcon className={`w-5 h-5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
              {getCartItemsCount() > 0 && (
                <span
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                    isDarkMode
                      ? "bg-red-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-cyan-400"
                      : "text-gray-700 hover:text-cyan-600"
                  }`}
                >
                  Login
                </Link>
                {/* Sign Up removed per request - only Login is shown */}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
              ) : (
                <Bars3Icon className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
              )}
            </button>
          </div>
        </div>

         {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden border-t transition-colors duration-300 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="px-2 py-4 space-y-2">
              {/* Mobile search */}
              <form onSubmit={onSearchSubmit} role="search" aria-label="Site search" className="px-1 pb-3">
                <div
                  className={`flex items-center rounded-full px-3 py-2 border focus-within:ring-2 transition shadow-sm ${
                    isDarkMode
                      ? "bg-gray-800/70 border-gray-700 focus-within:ring-cyan-500/40"
                      : "bg-white/90 border-gray-300 focus-within:ring-cyan-500/30"
                  }`}
                >
                  <MagnifyingGlassIcon className={`w-5 h-5 mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stores..."
                    className={`w-full bg-transparent outline-none text-sm ${
                      isDarkMode ? "text-gray-200 placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
                    }`}
                    aria-label="Search stores"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className={`ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full transition ${
                        isDarkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/60"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Clear search"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`ml-2 inline-flex items-center justify-center p-2 rounded-full text-sm font-medium transition ${
                      isDarkMode
                        ? "bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30"
                        : "bg-cyan-600/10 text-cyan-700 hover:bg-cyan-600/20"
                    }`}
                    aria-label="Search"
                    title="Search"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    isActive(item.path)
                      ? isDarkMode
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-cyan-100 text-cyan-600"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-cyan-400"
                      : "text-gray-700 hover:bg-gray-100 hover:text-cyan-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/address"
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Address
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-500/20"
                          : "text-red-600 hover:bg-red-50"
                        }`}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    {/* Sign Up removed from mobile menu per request */}
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
