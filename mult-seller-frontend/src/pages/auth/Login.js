import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Enhanced background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-30 animate-float" style={{ backgroundColor: '#3B82F6' }} />
        <div className="absolute top-20 -right-10 w-56 h-56 rounded-full blur-3xl opacity-25 animate-float" style={{ backgroundColor: '#F59E0B' }} />
        <div className="absolute bottom-10 left-1/2 w-32 h-32 rounded-full blur-2xl opacity-20 animate-float" style={{ backgroundColor: '#3B82F6', animationDelay: '2s' }} />
      </div>
      <div className={`max-w-md w-full space-y-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, #3B82F6, #F59E0B)` }}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: '#6B7280' }}>
            Or{' '}
            <Link
              to="/signup"
              className="font-medium transition-colors duration-300 hover:opacity-80"
              style={{ color: '#F59E0B' }}
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl shadow-lg -space-y-px overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border-0 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:z-10 input-focus-effect"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#111827',
                  '::placeholder': { color: '#6B7280' }
                }}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="border-t" style={{ borderColor: '#E5E7EB' }}>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border-0 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:z-10 input-focus-effect"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#111827',
                  '::placeholder': { color: '#6B7280' }
                }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl p-4 animate-shake" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <div className="text-sm font-medium" style={{ color: '#DC2626' }}>{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl button-glow"
              style={{ 
                backgroundColor: '#3B82F6',
                focusRingColor: '#3B82F6'
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof continueAsGuest === 'function') {
                  continueAsGuest();
                  navigate('/home');
                } else {
                  const guestUser = { id: 'guest', name: 'Guest', email: null, avatar: 'https://via.placeholder.com/40', isGuest: true };
                  localStorage.setItem('user', JSON.stringify(guestUser));
                  navigate('/home');
                  // Force a micro delay to ensure state sync in edge cases
                  setTimeout(() => {
                    if (!window.location.pathname.includes('/home')) {
                      window.location.href = '/home';
                    }
                  }, 0);
                }
              }}
              className="w-full py-3 px-4 text-sm font-medium rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow hover:shadow-lg"
              style={{ 
                borderColor: '#F59E0B',
                color: '#F59E0B',
                backgroundColor: 'white',
                focusRingColor: '#F59E0B'
              }}
            >
              Continue as Guest
            </button>
          </div>

          <div className="text-center text-xs" style={{ color: '#6B7280' }}>By continuing you agree to our Terms.</div>
        </form>
      </div>
    </div>
  );
};

export default Login;
