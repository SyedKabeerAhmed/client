import { buildApiUrl, API_CONFIG } from '../config/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Cart API Error:', {
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

class CartService {
  // Get user's cart
  async getCart() {
    try {
      const response = await fetch(buildApiUrl('/api/cart'), {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  }

  // Add item to cart
  async addToCart(cartData) {
    try {
      const response = await fetch(buildApiUrl('/api/cart/add'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cartData)
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    try {
      const response = await fetch(buildApiUrl(`/api/cart/update/${itemId}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  }

  // Remove item from cart
  async removeFromCart(itemId) {
    try {
      const response = await fetch(buildApiUrl(`/api/cart/remove/${itemId}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await fetch(buildApiUrl('/api/cart/clear'), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }

  // Apply discount code
  async applyDiscount(discountCode) {
    try {
      const response = await fetch(buildApiUrl('/api/cart/apply-discount'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ discountCode })
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to apply discount');
    }
  }

  // Helper method to format cart data for API
  formatCartData(productId, customization, quantity = 1, totalPrice = 0, isCustomHairSystem = false) {
    if (isCustomHairSystem) {
      // For HairCustomization
      return {
        productId: '507f1f77bcf86cd799439011', // Default product ID for HairCustomization
        quantity,
        totalPrice,
        isCustomHairSystem: true,
        customHairSystem: customization,
        isCustomized: true
      }
    }
    
    // For ProductDetail (existing logic)
    // Format customization object according to backend model
    const formattedCustomization = {
      hairColor: customization.hairColor || '',
      haircut: customization.haircut || '',
      cutToSize: customization.cutToSize || false,
      size: customization.size || '',
      additionalInfo: customization.additionalInfo || '',
      uploadedImages: customization.uploadedImages || []
    }

    // Only include hairLengths if it exists and is not null
    if (customization.hairLengths && typeof customization.hairLengths === 'object') {
      formattedCustomization.hairLengths = {
        front: customization.hairLengths.front || '',
        top: customization.hairLengths.top || '',
        crown: customization.hairLengths.crown || '',
        back: customization.hairLengths.back || '',
        temples: customization.hairLengths.temples || '',
        sides: customization.hairLengths.sides || ''
      }
    }

    const cartData = {
      productId,
      quantity,
      customization: formattedCustomization,
      totalPrice,
      isCustomized: true
    }

    // Add selected color if available
    if (customization.hairColor) {
      // Map color codes to valid enum values
      const getColorType = (colorCode) => {
        if (colorCode.includes('1A') || colorCode.includes('1B') || colorCode.includes('2') || colorCode.includes('3')) {
          return 'Black'
        } else if (colorCode.includes('4') || colorCode.includes('5') || colorCode.includes('6')) {
          return 'Brown'
        } else if (colorCode.includes('7') || colorCode.includes('8') || colorCode.includes('9')) {
          return 'Blonde'
        } else if (colorCode.includes('ASH') || colorCode.includes('GRAY')) {
          return 'Gray'
        }
        return 'Brown' // Default fallback
      }

      cartData.selectedColor = {
        colorType: getColorType(customization.hairColor),
        colorCode: customization.hairColor,
        colorImage: `${customization.hairColor.replace('#', '')}.png`
      }
    }

    // Add selected haircut if available
    if (customization.haircut && customization.haircut !== 'None') {
      if (customization.haircut === 'I want to order my hair length') {
        cartData.selectedHairCut = {
          hairCutCode: 'CUSTOM_LENGTH',
          hairCutImage: 'custom_length.png',
          price: 35.49
        }
        
        // Only include customLengths if hairLengths exists
        if (customization.hairLengths && typeof customization.hairLengths === 'object') {
          cartData.selectedHairCut.customLengths = {
            front: customization.hairLengths.front || '',
            top: customization.hairLengths.top || '',
            crown: customization.hairLengths.crown || '',
            back: customization.hairLengths.back || '',
            temples: customization.hairLengths.temples || '',
            sides: customization.hairLengths.sides || ''
          }
        }
      } else if (customization.haircut === 'Upload hairstyle images you want') {
        cartData.selectedHairCut = {
          hairCutCode: 'CUSTOM_IMAGE',
          hairCutImage: 'custom_image.png',
          price: 35.49
        }
        cartData.uploadedImage = customization.uploadedImages?.[0]?.name || 'custom_image.jpg'
      } else {
        cartData.selectedHairCut = {
          hairCutCode: customization.haircut,
          hairCutImage: `${customization.haircut}-1.png`,
          price: 35.49
        }
      }
    }

    // Add cut to size information
    if (customization.cutToSize) {
      cartData.cutToSize = {
        cutByStylist: false,
        cutToMySize: true
      }
      if (customization.size) {
        cartData.customMeasurements = {
          size: customization.size
        }
      }
    } else {
      cartData.cutToSize = {
        cutByStylist: true,
        cutToMySize: false
      }
    }

    // Add additional notes
    if (customization.additionalInformation) {
      cartData.additionalNotes = customization.additionalInformation
    }

    return cartData
  }
}

export const cartService = new CartService()
