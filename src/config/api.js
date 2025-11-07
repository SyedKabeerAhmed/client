import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      PROFILE: '/api/auth/profile',
      CHANGE_PASSWORD: '/api/auth/change-password'
    },
    PRODUCTS: {
      GET_ALL: '/api/products',
      SEARCH: '/api/products/search',
      SEARCH_BY_NAME: '/api/products/search-by-name',
      BEST_SELLING: '/api/products/best-selling',
      PREMIUM: '/api/products/premium',
      GET_BY_CODE: '/api/products/code/:productCode',
      GET_BY_CATEGORY: '/api/products/category/:categorySlug',
      GET_REVIEWS: '/api/products/:id/reviews',
      ADD_REVIEW: '/api/products/:id/reviews',
      GET_BY_ID: (id) => `/api/products/${id}`,
    },
    CATEGORIES: {
      GET_ALL: '/api/categories',
      GET_BY_SLUG: (slug) => `/api/categories/${slug}`,
      GET_SUBCATEGORIES: (categorySlug) => `/api/categories/${categorySlug}/subcategories`,
    },
    PRODUCTS_BY_CATEGORY: {
      MAIN_CATEGORY: (categorySlug) => `/api/products/category/${categorySlug}`,
      SUBCATEGORY: (categorySlug, subCategorySlug) => `/api/products/category/${categorySlug}/${subCategorySlug}`,
    },
    DASHBOARD: {
      USER: {
        DASHBOARD: '/api/user/dashboard',
        ORDERS: '/api/user/orders',
        WISHLIST: '/api/user/wishlist',
        COUPONS: '/api/user/coupons',
        APPLY_COUPON: '/api/user/coupons/apply',
        ORDER_TRACKING: (orderNumber) => `/api/user/orders/tracking/${orderNumber}`
      },
      ADMIN: {
        DASHBOARD: '/api/admin/dashboard',
        USERS: '/api/admin/users',
        ORDERS: '/api/admin/orders',
        COUPONS: '/api/admin/coupons'
      },
      SUBADMIN: {
        DASHBOARD: '/api/subadmin/dashboard',
        ORDERS: '/api/subadmin/orders',
        PRODUCTS: '/api/subadmin/products',
        CATEGORIES: '/api/subadmin/categories'
      },
      FACTORY: {
        DASHBOARD: '/api/factory/dashboard',
        ORDERS: '/api/factory/orders',
        ORDER_BY_NUMBER: (orderNumber) => `/api/factory/orders/number/${orderNumber}`,
        ORDER_PRODUCTION: (orderId) => `/api/factory/orders/${orderId}/production`
      }
    }
  }
}

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
