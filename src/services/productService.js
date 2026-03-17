import { buildApiUrl, API_CONFIG } from '../config/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    console.error('Product API Error:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });

    throw new Error(data.message || 'Something went wrong');
  }

  // Handle both wrapped and direct response formats
  if (data.success !== undefined) {
    return data; // Wrapped format: { success: true, data: {...} }
  } else {
    return data; // Direct format: { products: [...], pagination: {...} }
  }
};

// Product service functions
export const productService = {
  // Get all products with filtering and pagination
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    // Add filtering
    if (params.category) queryParams.append('category', params.category);
    if (params.subCategory) queryParams.append('subCategory', params.subCategory);
    if (params.bestSelling) queryParams.append('bestSelling', params.bestSelling);
    if (params.premiumProduct) queryParams.append('premiumProduct', params.premiumProduct);
    if (params.search) queryParams.append('search', params.search);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.choseBy) queryParams.append('choseBy', params.choseBy);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.GET_ALL)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Search products (general search)
  searchProducts: async (query, params = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH)}?${queryParams.toString()}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Search products by name specifically
  searchProductsByName: async (name, params = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('name', name);

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH_BY_NAME)}?${queryParams.toString()}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get best selling products
  getBestSellingProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.BEST_SELLING)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get premium products
  getPremiumProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.PREMIUM)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get single product by ID
  getProductById: async (productId) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.GET_BY_ID(productId));

    console.log('🚀 ProductService - Get Product By ID:', {
      productId,
      url
    });

    const response = await fetch(url);
    const result = await handleResponse(response);

    console.log('🚀 ProductService - Product By ID Response:', result);

    return result;
  },

  // Get products by main category only
  getProductsByMainCategory: async (categorySlug, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY.MAIN_CATEGORY(categorySlug))}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get products by category and subcategory
  getProductsByCategoryAndSubcategory: async (categorySlug, subCategorySlug, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY.SUBCATEGORY(categorySlug, subCategorySlug))}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    console.log('🚀 Subcategory API Call:', {
      categorySlug,
      subCategorySlug,
      url,
      params,
      baseUrl: API_CONFIG.BASE_URL,
      endpoint: API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY.SUBCATEGORY(categorySlug, subCategorySlug)
    });

    const response = await fetch(url);

    console.log('🚀 Subcategory Response Status:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    const result = await handleResponse(response);

    console.log('🚀 Subcategory Final Result:', result);

    return result;
  },

  // Legacy function - kept for backward compatibility
  getProductsByCategory: async (categorySlug, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.GET_BY_CATEGORY.replace(':categorySlug', categorySlug))}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.GET_REVIEWS.replace(':id', productId))}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.ADD_REVIEW.replace(':id', productId))}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });

    return handleResponse(response);
  },

  // Combined search function that searches both by name and code
  searchProductsCombined: async (query, params = {}) => {
    try {
      // Search by name first
      const nameResults = await productService.searchProductsByName(query, params);

      // Search by code
      const codeResults = await productService.searchProducts(query, params);

      // Extract products from both results (handle API response format)
      const nameProducts = nameResults.success ? nameResults.data.products : nameResults.products || [];
      const codeProducts = codeResults.success ? codeResults.data.products : codeResults.products || [];

      // Combine and deduplicate results
      const allProducts = [...nameProducts, ...codeProducts];

      // Remove duplicates based on product _id
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p._id === product._id)
      );

      // Return in API response format
      return {
        success: true,
        data: {
          products: uniqueProducts,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalProducts: uniqueProducts.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    } catch (error) {
      console.error('Combined search error:', error);
      throw error;
    }
  }
};

export default productService;
