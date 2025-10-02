import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Homepage from './pages/home/Homepage';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';
import StorePage from './pages/store/StorePage';
import CartPage from './pages/cart/CartPage';
import ProductPage from './pages/product/ProductPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div className="transition-all duration-300">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/store/:storeId" element={<StorePage />} />
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
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              <AnimatedRoutes />
              <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
            </div>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
