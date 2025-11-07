import { buildApiUrl, API_CONFIG } from '../config/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Category API Error:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    throw new Error(data.message || 'Something went wrong');
  }
  
  // Handle different response formats
  if (data.success !== undefined) {
    return data.data || data; // Wrapped format: { success: true, data: {...} }
  } else if (data.categories) {
    return data.categories; // Format: { categories: [...] }
  } else if (data.result) {
    return data.result; // Format: { result: [...] }
  } else {
    return data; // Direct format: [...] or single object
  }
};

// Category service functions
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL);
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.GET_BY_SLUG(slug));
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get subcategories for a category
  getSubcategories: async (categorySlug) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.GET_SUBCATEGORIES(categorySlug));
    
    const response = await fetch(url);
    return handleResponse(response);
  }
};

export default categoryService;
