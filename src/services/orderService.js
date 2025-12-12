import { buildApiUrl } from '../config/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Order API Error:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

class OrderService {
  // Create order from cart
  async createOrder(orderData) {
    try {
      const response = await fetch(buildApiUrl('/api/orders/create'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || 'Failed to create order');
    }
  }

  // Get user's orders
  async getUserOrders(page = 1, limit = 10, status = null) {
    try {
      let url = buildApiUrl(`/api/orders?page=${page}&limit=${limit}`);
      if (status) {
        url += `&status=${status}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  // Get single order
  async getOrder(orderId) {
    try {
      const response = await fetch(buildApiUrl(`/api/orders/${orderId}`), {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch order');
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await fetch(buildApiUrl(`/api/orders/${orderId}/cancel`), {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel order');
    }
  }
}

export const orderService = new OrderService()

