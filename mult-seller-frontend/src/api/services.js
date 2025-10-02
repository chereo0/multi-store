// Placeholder API service functions
// These will be replaced with actual Laravel backend API calls
import api from './index';

// Mock data for development
const mockCategories = [
  { id: 1, name: 'Electronics', slug: 'electronics', image: 'https://via.placeholder.com/200x150?text=Electronics', icon: '📱' },
  { id: 2, name: 'Fashion', slug: 'fashion', image: 'https://via.placeholder.com/200x150?text=Fashion', icon: '👗' },
  { id: 3, name: 'Home & Garden', slug: 'home-garden', image: 'https://via.placeholder.com/200x150?text=Home+Garden', icon: '🏠' },
  { id: 4, name: 'Sports', slug: 'sports', image: 'https://via.placeholder.com/200x150?text=Sports', icon: '⚽' },
  { id: 5, name: 'Books', slug: 'books', image: 'https://via.placeholder.com/200x150?text=Books', icon: '📚' },
  { id: 6, name: 'Beauty', slug: 'beauty', image: 'https://via.placeholder.com/200x150?text=Beauty', icon: '💄' }
];

const mockStores = [
  {
    id: 1,
    name: 'TechWorld Store',
    description: 'Your one-stop shop for all electronics',
    banner: 'https://via.placeholder.com/800x300?text=TechWorld+Banner',
    logo: 'https://via.placeholder.com/100x100?text=TW',
    rating: 4.5,
    reviewCount: 128,
    category: 'Electronics',
    isVerified: true
  },
  {
    id: 2,
    name: 'Fashion Hub',
    description: 'Trendy fashion for everyone',
    banner: 'https://via.placeholder.com/800x300?text=Fashion+Hub+Banner',
    logo: 'https://via.placeholder.com/100x100?text=FH',
    rating: 4.2,
    reviewCount: 89,
    category: 'Fashion',
    isVerified: true
  },
  {
    id: 3,
    name: 'Home Decor Plus',
    description: 'Beautiful home decorations',
    banner: 'https://via.placeholder.com/800x300?text=Home+Decor+Banner',
    logo: 'https://via.placeholder.com/100x100?text=HD',
    rating: 4.7,
    reviewCount: 156,
    category: 'Home & Garden',
    isVerified: false
  }
];

const mockProducts = {
  1: [ // TechWorld Store products
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      image: 'https://via.placeholder.com/300x300?text=Headphones',
      rating: 4.3,
      reviewCount: 45,
      inStock: true
    },
    {
      id: 2,
      name: 'Smartphone Case',
      description: 'Protective case for your smartphone',
      price: 19.99,
      image: 'https://via.placeholder.com/300x300?text=Phone+Case',
      rating: 4.1,
      reviewCount: 23,
      inStock: true
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with great sound',
      price: 79.99,
      image: 'https://via.placeholder.com/300x300?text=Speaker',
      rating: 4.5,
      reviewCount: 67,
      inStock: false
    }
  ],
  2: [ // Fashion Hub products
    {
      id: 4,
      name: 'Summer Dress',
      description: 'Elegant summer dress perfect for any occasion',
      price: 49.99,
      image: 'https://via.placeholder.com/300x300?text=Summer+Dress',
      rating: 4.4,
      reviewCount: 34,
      inStock: true
    },
    {
      id: 5,
      name: 'Denim Jacket',
      description: 'Classic denim jacket for casual wear',
      price: 69.99,
      image: 'https://via.placeholder.com/300x300?text=Denim+Jacket',
      rating: 4.2,
      reviewCount: 28,
      inStock: true
    }
  ],
  3: [ // Home Decor Plus products
    {
      id: 6,
      name: 'Decorative Vase',
      description: 'Beautiful ceramic vase for your home',
      price: 39.99,
      image: 'https://via.placeholder.com/300x300?text=Vase',
      rating: 4.6,
      reviewCount: 19,
      inStock: true
    },
    {
      id: 7,
      name: 'Wall Art',
      description: 'Modern wall art to enhance your space',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300?text=Wall+Art',
      rating: 4.8,
      reviewCount: 42,
      inStock: true
    }
  ]
};

const mockReviews = {
  stores: {
    1: [
      {
        id: 1,
        userId: 1,
        userName: 'John Doe',
        userAvatar: 'https://via.placeholder.com/40',
        rating: 5,
        comment: 'Great store with excellent products and fast delivery!',
        date: '2024-01-15'
      },
      {
        id: 2,
        userId: 2,
        userName: 'Jane Smith',
        userAvatar: 'https://via.placeholder.com/40',
        rating: 4,
        comment: 'Good selection of electronics, customer service could be better.',
        date: '2024-01-10'
      }
    ]
  },
  products: {
    1: [
      {
        id: 1,
        userId: 1,
        userName: 'John Doe',
        userAvatar: 'https://via.placeholder.com/40',
        rating: 5,
        comment: 'Amazing sound quality! Highly recommended.',
        date: '2024-01-12'
      }
    ]
  }
};

// API Functions
export const getCategories = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, data: mockCategories };
};

export const getStores = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, data: mockStores };
};

export const getCategoryBySlug = async (slug) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const category = mockCategories.find(c => c.slug === String(slug));
  return { success: !!category, data: category };
};

export const getStoresByCategory = async (categoryIdOrSlug) => {
  // Accept id or slug for convenience
  await new Promise(resolve => setTimeout(resolve, 500));
  let category = null;
  if (typeof categoryIdOrSlug === 'number' || /^[0-9]+$/.test(String(categoryIdOrSlug))) {
    category = mockCategories.find(c => c.id === Number(categoryIdOrSlug));
  } else {
    category = mockCategories.find(c => c.slug === String(categoryIdOrSlug));
  }
  if (!category) return { success: false, data: [] };
  const stores = mockStores.filter(s => s.category === category.name);
  return { success: true, data: stores };
};

export const getStore = async (storeId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const store = mockStores.find(s => s.id === parseInt(storeId));
  return { success: !!store, data: store };
};

export const getProducts = async (storeId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  const products = mockProducts[storeId] || [];
  return { success: true, data: products };
};

export const getProduct = async (productId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  let product = null;
  for (const storeProducts of Object.values(mockProducts)) {
    product = storeProducts.find(p => p.id === parseInt(productId));
    if (product) break;
  }
  return { success: !!product, data: product };
};

export const getStoreReviews = async (storeId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const reviews = mockReviews.stores[storeId] || [];
  return { success: true, data: reviews };
};

export const getProductReviews = async (productId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const reviews = mockReviews.products[productId] || [];
  return { success: true, data: reviews };
};

export const submitStoreReview = async (storeId, reviewData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would send data to backend
  return { success: true, message: 'Review submitted successfully' };
};

export const submitProductReview = async (productId, reviewData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would send data to backend
  return { success: true, message: 'Review submitted successfully' };
};

export const submitOrder = async (orderData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In real implementation, this would send order data to backend
  const orderId = Math.floor(Math.random() * 1000000);
  return { 
    success: true, 
    data: { 
      orderId, 
      message: 'Order placed successfully',
      estimatedDelivery: '3-5 business days'
    } 
  };
};

// Get or refresh client credentials token
export const getClientToken = async () => {
  try {
    // Prepare client credentials with the correct values
    const clientCredentials = {
      client_id: process.env.REACT_APP_CLIENT_ID || 'shopping_oauth_client',
      client_secret: process.env.REACT_APP_CLIENT_SECRET || 'shopping_oauth_secret',
      grant_type: 'client_credentials'
    };

    const response = await fetch('https://multi-store-api.cloudgoup.com/api/rest/oauth2/token/client_credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(clientCredentials),
    });

    const data = await response.json();
    
    // Check for success and extract token from the correct location
    if (response.ok && data.success === 1 && data.data && data.data.access_token) {
      // Store the token for future use
      localStorage.setItem('client_token', data.data.access_token);
      console.log('Client token obtained successfully:', data.data.access_token.substring(0, 20) + '...');
      return data.data.access_token;
    } else {
      console.error('Failed to get client token:', data);
      return null;
    }
  } catch (error) {
    console.error('Client token error:', error);
    return null;
  }
};

// Auth APIs
export const registerUser = async (payload) => {
  try {
    // Get client credentials token first
    let token = localStorage.getItem('client_token');
    
    // If no token or token might be expired, get a new one
    if (!token) {
      token = await getClientToken();
      if (!token) {
        return { success: false, message: 'Failed to authenticate with server. Please try again.' };
      }
    }

    // Use the actual API endpoint with authorization
    const response = await fetch('https://multi-store-api.cloudgoup.com/api/rest/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // If unauthorized, try to get a new token and retry once
    if (response.status === 401) {
      console.log('Token expired, getting new token...');
      token = await getClientToken();
      if (token) {
        const retryResponse = await fetch('https://multi-store-api.cloudgoup.com/api/rest/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        
        const retryData = await retryResponse.json();
        
        if (retryResponse.ok) {
          return { success: true, ...retryData };
        } else {
          return { success: false, message: retryData.message || 'Registration failed', errors: retryData.errors };
        }
      } else {
        return { success: false, message: 'Authentication failed. Please try again.' };
      }
    }
    
    if (response.ok) {
      // Handle both success: 1 and success: true patterns
      if (data.success === 1 || data.success === true) {
        return { success: true, ...data };
      } else {
        return { success: false, message: data.message || 'Registration failed', errors: data.errors };
      }
    } else {
      return { success: false, message: data.message || 'Registration failed', errors: data.errors };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

export const getClientCredentialsToken = async (
  clientId = process.env.REACT_APP_OAUTH_CLIENT_ID || 'shopping_oauth_client',
  clientSecret = process.env.REACT_APP_OAUTH_CLIENT_SECRET || 'shopping_oauth_secret'
) => {
  const payload = new URLSearchParams();
  payload.append('client_id', clientId);
  payload.append('client_secret', clientSecret);
  payload.append('grant_type', 'client_credentials');
  const explicitTokenUrl = process.env.REACT_APP_TOKEN_URL;
  const defaultAbsoluteTokenUrl = 'https://multi-store-api.cloudgoup.com/api/rest/oauth2/token';
  const base = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  const url = (explicitTokenUrl && typeof explicitTokenUrl === 'string')
    ? explicitTokenUrl
    : (base ? `${base}/oauth2/token` : defaultAbsoluteTokenUrl);
  const response = await api.post(url, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const fetchAndStoreClientToken = async () => {
  const data = await getClientCredentialsToken();
  const token = data?.access_token || data?.token || data?.data?.access_token;
  if (token) {
    try {
      localStorage.setItem('client_token', token);
    } catch (_e) {}
  }
  return data;
};

// Login API function
export const loginUser = async (email, password) => {
  try {
    // Get client credentials token first
    let token = localStorage.getItem('client_token');
    
    // If no token or token might be expired, get a new one
    if (!token) {
      token = await getClientToken();
      if (!token) {
        return { success: false, message: 'Failed to authenticate with server. Please try again.' };
      }
    }

    // Prepare login payload
    const payload = {
      email: email,
      password: password
    };

    // Use the actual login API endpoint with authorization
    const response = await fetch('https://multi-store-api.cloudgoup.com/api/rest/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // If unauthorized, try to get a new token and retry once
    if (response.status === 401) {
      console.log('Token expired, getting new token...');
      token = await getClientToken();
      if (token) {
        const retryResponse = await fetch('https://multi-store-api.cloudgoup.com/api/rest/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        
        const retryData = await retryResponse.json();
        
        if (retryResponse.ok) {
          // Handle both success: 1 and success: true patterns
          if (retryData.success === 1 || retryData.success === true) {
            return { success: true, ...retryData };
          } else {
            return { success: false, message: retryData.message || 'Login failed', errors: retryData.errors };
          }
        } else {
          return { success: false, message: retryData.message || 'Login failed', errors: retryData.errors };
        }
      } else {
        return { success: false, message: 'Authentication failed. Please try again.' };
      }
    }
    
    if (response.ok) {
      // Handle both success: 1 and success: true patterns
      if (data.success === 1 || data.success === true) {
        return { success: true, ...data };
      } else {
        return { success: false, message: data.message || 'Login failed', errors: data.errors };
      }
    } else {
      return { success: false, message: data.message || 'Login failed', errors: data.errors };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};
