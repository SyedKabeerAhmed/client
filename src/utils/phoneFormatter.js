// Phone number formatting utility
export const formatPhoneNumber = (phoneNumber, countryCode = '+92') => {
  if (!phoneNumber) return phoneNumber;
  
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it starts with 0, remove it and add country code
  if (cleaned.startsWith('0')) {
    cleaned = countryCode + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    // If it doesn't start with +, add it
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// Validate phone number format
export const isValidPhoneNumber = (phoneNumber) => {
  // Regex from your backend schema
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phoneNumber);
};

// Get country code from phone number
export const getCountryCode = (phoneNumber) => {
  if (phoneNumber.startsWith('+92')) return '+92';
  if (phoneNumber.startsWith('+1')) return '+1';
  if (phoneNumber.startsWith('+44')) return '+44';
  // Add more country codes as needed
  return '+92'; // Default to Pakistan
};
