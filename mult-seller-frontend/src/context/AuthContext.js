import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api/services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = !!(user && user.isGuest);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userDataOrEmail, password) => {
    try {
      // If userDataOrEmail is an object, it's user data from OTP verification
      if (typeof userDataOrEmail === 'object') {
        setUser(userDataOrEmail);
        localStorage.setItem('user', JSON.stringify(userDataOrEmail));
        return { success: true };
      }
      
      // Otherwise, it's email/password login - use actual API
      const result = await loginUser(userDataOrEmail, password);
      
      if (result.success) {
        // Extract user data from API response
        const userData = {
          id: result.user?.id || result.data?.user?.id || result.data?.id,
          email: userDataOrEmail,
          name: result.user?.name || result.data?.user?.name || `${result.user?.firstname || result.data?.user?.firstname || ''} ${result.user?.lastname || result.data?.user?.lastname || ''}`.trim() || 'User',
          firstname: result.user?.firstname || result.data?.user?.firstname,
          lastname: result.user?.lastname || result.data?.user?.lastname,
          username: result.user?.username || result.data?.user?.username,
          telephone: result.user?.telephone || result.data?.user?.telephone,
          avatar: result.user?.avatar || result.data?.user?.avatar || 'https://via.placeholder.com/40',
          token: result.token || result.data?.token || result.access_token || result.data?.access_token
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store auth token if provided
        if (userData.token) {
          localStorage.setItem('auth_token', userData.token);
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An error occurred during login' };
    }
  };

  const signup = async (userData) => {
    try {
      // Align with backend requirement: include confirm field
      const payload = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        telephone: userData.telephone,
        fax: userData.fax || '',
        password: userData.password,
        confirm: userData.password
      };

      console.log('Sending signup payload:', payload);
      const result = await registerUser(payload);
      console.log('Signup result:', result);

      // Check if registration was successful (handle both success: true and success: 1)
      if (result && (result.success === true || result.success === 1)) {
        // Don't set user yet - wait for OTP verification
        // Return success with user data for OTP verification
        return { 
          success: true, 
          user: {
            id: result.user?.id || result.data?.id || result.data?.user?.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            email: userData.email,
            telephone: userData.telephone,
            fax: userData.fax
          }
        };
      }

      // Handle validation errors
      if (result.errors) {
        const errorMessages = Object.values(result.errors).flat();
        return { success: false, error: errorMessages.join(', ') };
      }

      // If backend returns a message or errors
      return { success: false, error: result?.message || result?.error || 'Registration failed. Please check the console for details.' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'An error occurred during signup' };
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Clear all stored data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    
    // Optional: Keep client_token for future API calls
    // localStorage.removeItem('client_token');
  };
  

  const continueAsGuest = () => {
    const guestUser = {
      id: 'guest',
      name: 'Guest',
      email: null,
      avatar: 'https://via.placeholder.com/40',
      isGuest: true
    };
    
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
  };

  const value = {
    user,
    isGuest,
    login,
    signup,
    logout,
    continueAsGuest,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
