// Utility functions for Mzuzu Application

/**
 * Simple email validation
 */
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Simple password validation (minimum 6 characters)
 */
export const isValidPassword = (password: string) => {
  return password.length >= 6;
};
