/**
 * Validation Utilities
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validateAadhar = (aadhar) => {
  const re = /^[0-9]{12}$/;
  return re.test(aadhar);
};

export const validatePassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

export const validateRegistrationNumber = (regNumber) => {
  // 16 digits
  const re = /^[0-9]{16}$/;
  return re.test(regNumber);
};

export const getErrorMessage = (error) => {
  if (error?.data?.details && Array.isArray(error.data.details)) {
    return error.data.details[0] || error.data.message || 'An error occurred';
  }
  return error?.data?.message || error?.message || 'An error occurred';
};
