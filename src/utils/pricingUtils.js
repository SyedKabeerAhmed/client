/**
 * Utility functions for pricing based on user type
 */

/**
 * Check if a user is a business user
 * @param {Object} user - User object from auth context
 * @returns {boolean} - True if user is a business user
 */
export const isBusinessUser = (user) => {
  if (!user) return false;
  
  // Check userType field
  if (user.userType === 'business') {
    return true;
  }
  
  // Check role field
  if (user.role === 'business_user') {
    return true;
  }
  
  return false;
};

/**
 * Get the appropriate price for a product based on user type
 * @param {Object} pricing - Product pricing object
 * @param {Object} user - User object from auth context
 * @param {boolean} useDiscounted - Whether to use discounted price if available
 * @returns {number} - The appropriate price
 */
export const getPriceForUser = (pricing, user, useDiscounted = false) => {
  if (!pricing) return 0;
  
  const isBusiness = isBusinessUser(user);
  
  if (isBusiness) {
    // Business users see business prices
    if (useDiscounted && pricing.discountedPriceForBusiness) {
      return pricing.discountedPriceForBusiness;
    }
    return pricing.priceForBusiness || pricing.actualBasePrice || 0;
  } else {
    // Individual users see individual prices
    if (useDiscounted && pricing.discountedPriceForIndividual) {
      return pricing.discountedPriceForIndividual;
    }
    return pricing.priceForIndividual || pricing.actualBasePrice || 0;
  }
};

/**
 * Get the base price (non-discounted) for a product based on user type
 * @param {Object} pricing - Product pricing object
 * @param {Object} user - User object from auth context
 * @returns {number} - The base price
 */
export const getBasePriceForUser = (pricing, user) => {
  return getPriceForUser(pricing, user, false);
};

/**
 * Get the discounted price for a product based on user type
 * @param {Object} pricing - Product pricing object
 * @param {Object} user - User object from auth context
 * @returns {number|null} - The discounted price, or null if not available
 */
export const getDiscountedPriceForUser = (pricing, user) => {
  if (!pricing) return null;
  
  const isBusiness = isBusinessUser(user);
  
  if (isBusiness) {
    return pricing.discountedPriceForBusiness || null;
  } else {
    return pricing.discountedPriceForIndividual || null;
  }
};

