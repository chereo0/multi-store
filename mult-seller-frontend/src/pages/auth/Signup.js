import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThreeScene from '../../components/ThreeScene';
import '../../styles/animations.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    fax: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formInteraction, setFormInteraction] = useState(0);

  const { signup, continueAsGuest } = useAuth();
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
    // Increase interaction counter for 3D animation
    setFormInteraction(prev => Math.min(prev + 1, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await signup({
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        telephone: formData.telephone,
        fax: formData.fax,
        password: formData.password
      });
      
      if (result.success) {
        // Navigate to OTP verification with user data
        navigate('/verify-otp', {
          state: {
            userData: {
              id: result.user?.id,
              firstname: formData.firstname,
              lastname: formData.lastname,
              username: formData.username,
              email: formData.email,
              telephone: formData.telephone,
            }
          }
        });
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative" style={{ backgroundColor: '#F9FAFB' }}>
      {/* 3D Animated Background */}
      <ThreeScene formInteraction={formInteraction} />
      
      {/* Enhanced background effects with new color palette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl animate-float" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 70%, transparent 100%)' }} />
        <div className="absolute top-20 -right-10 w-56 h-56 rounded-full blur-3xl animate-float" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 70%, transparent 100%)' }} />
        <div className="absolute bottom-10 left-1/3 w-32 h-32 rounded-full blur-3xl animate-float" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.03) 70%, transparent 100%)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full blur-2xl animate-float" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 70%, transparent 100%)', animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 rounded-full blur-3xl animate-float" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 100%)', animationDelay: '0.5s' }} />
      </div>
      <div className={`max-w-2xl w-full transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100/50 shadow-2xl rounded-3xl p-6 sm:p-8 relative z-10 glass-effect hover-lift" style={{ boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.05)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 animate-shimmer" style={{ color: '#111827' }}>
              Create Your Account
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-4" style={{ background: 'linear-gradient(90deg, #3B82F6, #F59E0B)' }}></div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Join our amazing community or{' '}
              <Link
                to="/login"
                className="font-semibold transition-all duration-300 underline underline-offset-2 hover:opacity-80"
                style={{ color: '#F59E0B' }}
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1 group">
                <label htmlFor="firstname" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                  First Name
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6',
                    '--placeholder-color': '#6B7280'
                  }}
                  placeholder="Enter your first name"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-1 group">
                <label htmlFor="lastname" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                  Last Name
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6',
                    '--placeholder-color': '#6B7280'
                  }}
                  placeholder="Enter your last name"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-1 group">
                <label htmlFor="username" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                  Username
              </label>
              <input
                  id="username"
                  name="username"
                type="text"
                required
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6',
                    '--placeholder-color': '#6B7280'
                  }}
                  placeholder="Choose a username"
                  value={formData.username}
                onChange={handleChange}
              />
            </div>

              <div className="md:col-span-1 group">
                <label htmlFor="email" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6',
                    '--placeholder-color': '#6B7280'
                  }}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

              <div className="md:col-span-1 group">
                <label htmlFor="telephone" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                  Telephone
              </label>
              <input
                  id="telephone"
                  name="telephone"
                type="tel"
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#F59E0B',
                    '--placeholder-color': '#6B7280'
                  }}
                  placeholder="Enter your telephone number"
                  value={formData.telephone}
                onChange={handleChange}
              />
            </div>

              <div className="md:col-span-1 group">
                <label htmlFor="fax" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                  Fax
              </label>
                <input
                  id="fax"
                  name="fax"
                  type="text"
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#F59E0B',
                    '--placeholder-color': '#6B7280'
                  }}
                  placeholder="Enter your fax (optional)"
                  value={formData.fax}
                onChange={handleChange}
              />
            </div>

              

              <div className="md:col-span-1 group">
                <label htmlFor="password" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6',
                    '--placeholder-color': '#6B7280'
                  }}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
                <p className="mt-2 text-xs font-medium" style={{ color: '#6B7280' }}>Minimum 6 characters.</p>
            </div>

              <div className="md:col-span-1 group">
                <label htmlFor="confirmPassword" className="block text-xs font-bold tracking-wide uppercase mb-2 transition-colors duration-300" style={{ color: '#111827' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                  className="block w-full rounded-xl border-0 ring-2 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm input-focus-effect backdrop-blur-sm"
                  style={{
                    color: '#111827',
                    borderColor: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6',
                    '--placeholder-color': '#6B7280'
                  }}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm shadow-lg backdrop-blur-sm animate-pulse" style={{ borderColor: '#FEE2E2', backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                <span className="text-lg">⚠️</span>
                <div className="font-medium">{error}</div>
            </div>
          )}

            <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 active:scale-95 transform-gpu button-glow"
                style={{
                  backgroundColor: '#3B82F6',
                  boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
                  '--tw-ring-color': 'rgba(59, 130, 246, 0.5)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' }}></div>
              <span className="relative z-10">
                {loading ? <span className="loading-dots">Creating account</span> : '✨ Create Account ✨'}
              </span>
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
                    setTimeout(() => {
                      if (!window.location.pathname.includes('/home')) {
                        window.location.href = '/home';
                      }
                    }, 0);
                  }
                }}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border-2 bg-white px-6 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 active:scale-95 transform-gpu"
                style={{
                  borderColor: '#F59E0B',
                  color: '#F59E0B',
                  '--tw-ring-color': 'rgba(245, 158, 11, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F59E0B';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#F59E0B';
                }}
              >
                🚀 Continue as Guest
              </button>
              <div className="mt-4 text-center text-xs font-medium" style={{ color: '#6B7280' }}>By continuing you agree to our <span className="cursor-pointer underline transition-colors duration-300" style={{ color: '#F59E0B' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Terms of Service</span> and <span className="cursor-pointer underline transition-colors duration-300" style={{ color: '#F59E0B' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Privacy Policy</span>.</div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
