import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

// Pages
import Homepage from './pages/home/Homepage';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AuthPage from './pages/auth/AuthPage';
import VerifyOTP from './pages/auth/VerifyOTP';
import StorePage from './pages/store/StorePage';
import PhoenixEmporium from './pages/store/PhoenixEmporium';
import CartPage from './pages/cart/CartPage';
import ProductPage from './pages/product/ProductPage';
import AboutPage from './pages/AboutPage';
import StoresPage from './pages/StoresPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import AddressPage from './pages/AddressPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div className="transition-all duration-300">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/store/:storeId" element={<StorePage />} />
        <Route path="/store/phoenix" element={<PhoenixEmporium />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize client token on app start
    (async () => {
      try {
        const mod = await import('./api/services');
        if (typeof mod.getClientToken === 'function') {
          await mod.getClientToken();
          console.log('Client token initialized');
        }
      } catch (error) {
        console.error('Failed to initialize client token:', error);
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <div className="App">
                <Navbar />
                <AnimatedRoutes />
                <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
              </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
