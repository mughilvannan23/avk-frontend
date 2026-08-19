/**
 * Formats a numeric value into the Indian Rupee string representation (e.g., Rs.33,599)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "Rs.0";
  return "Rs." + Number(amount).toLocaleString("en-IN");
};
