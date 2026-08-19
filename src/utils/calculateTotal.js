export const FREE_SHIPPING_THRESHOLD = 5000;

/**
 * Calculates the subtotal of items in the cart
 * @param {Array} cartItems - Array of cart item objects
 * @returns {number} - Subtotal amount
 */
export const calculateSubtotal = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Calculates the total quantity of items in the cart
 * @param {Array} cartItems - Array of cart item objects
 * @returns {number} - Total items count
 */
export const calculateTotalItems = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Checks if the subtotal qualifies for free shipping
 * @param {number} subtotal - The subtotal amount
 * @returns {boolean} - True if eligible for free shipping
 */
export const checkFreeShipping = (subtotal) => {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
};
