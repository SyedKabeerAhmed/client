import { buildApiUrl, API_CONFIG } from '../config/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Log the full error response for debugging
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    // Handle validation errors specifically
    if (response.status === 400 && data.errors) {
      const errorMessages = data.errors.map(error => error.msg || error.message).join(', ');
      throw new Error(errorMessages);
    }
    
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// API service functions
export const authService = {
  // Register a new user
  register: async (userData) => {
    // Log the data being sent for debugging
    console.log('Registering user with data:', userData);
    console.log('API URL:', buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER));
    
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.data && data.data.token) {
      setAuthToken(data.data.token);
    }
    
    return data;
  },

  // Forgot password - Send OTP
  forgotPassword: async (email) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    return handleResponse(response);
  },

  // Reset password with OTP
  resetPassword: async (resetData) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });
    
    return handleResponse(response);
  },

  // Get user profile
  getProfile: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    return handleResponse(response);
  },

  // Change password
  changePassword: async (passwordData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
    
    return handleResponse(response);
  },

  // Logout user
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  // Store user data
  setStoredUser: (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  // Clear stored user data
  clearStoredUser: () => {
    localStorage.removeItem('userData');
  }
};

export default authService;
