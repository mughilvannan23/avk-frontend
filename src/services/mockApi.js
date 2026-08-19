import { productService } from './api';
import { products as localProducts } from '../data/products';
import { NAV_CATEGORIES } from '../data/categories';

export const mockApi = {
  /**
   * Fetches list of products from MongoDB via Express API with fallback to static products dataset
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} - Resolves to list of products
   */
  getProducts: async (filters = {}) => {
    try {
      const apiFilters = {};

      if (filters.category && filters.category !== 'All') {
        apiFilters.category = filters.category;
      }
      if (filters.material && filters.material.length > 0) {
        apiFilters.material = Array.isArray(filters.material) ? filters.material.join(',') : filters.material;
      }
      if (filters.priceMin !== undefined) {
        apiFilters.priceMin = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        apiFilters.priceMax = filters.priceMax;
      }
      if (filters.searchQuery) {
        apiFilters.search = filters.searchQuery;
      }
      if (filters.sortBy) {
        apiFilters.sortBy = filters.sortBy;
      }

      const res = await productService.getProducts(apiFilters);
      if (Array.isArray(res)) {
        return res;
      }
    } catch (error) {
      console.warn("API getProducts Error, falling back to local static dataset:", error?.message || error);
    }

    // Fallback filtering using local dataset
    let result = [...localProducts];

    if (filters.category && filters.category !== 'All') {
      const targetCat = filters.category.toLowerCase().trim();
      result = result.filter(p => p.category && p.category.toLowerCase().trim() === targetCat);
    }

    if (filters.material && filters.material.length > 0) {
      const mats = (Array.isArray(filters.material) ? filters.material : filters.material.split(','))
        .map(m => m.trim().toLowerCase())
        .filter(Boolean);
      if (mats.length > 0) {
        result = result.filter(p => p.material && mats.some(m => p.material.toLowerCase().includes(m)));
      }
    }

    if (filters.priceMin !== undefined && filters.priceMin !== '') {
      result = result.filter(p => p.price >= Number(filters.priceMin));
    }

    if (filters.priceMax !== undefined && filters.priceMax !== '') {
      result = result.filter(p => p.price <= Number(filters.priceMax));
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q))
      );
    }

    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  },

  /**
   * Fetches distinct categories dynamically from MongoDB API with local fallback
   * @returns {Promise<Array<string>>}
   */
  getCategories: async () => {
    try {
      const categories = await productService.getCategories();
      if (Array.isArray(categories)) {
        return Array.from(new Set([...NAV_CATEGORIES, ...categories])).filter(Boolean);
      }
    } catch (error) {
      console.warn("API getCategories Error, falling back to default categories:", error?.message || error);
    }
    const localCats = localProducts.map(p => p.category).filter(Boolean);
    return Array.from(new Set([...NAV_CATEGORIES, ...localCats])).filter(Boolean);
  },

  /**
   * Fetches a single product by its unique ID from MongoDB with fallback
   * @param {string} id - Product ID
   * @returns {Promise<Object>} - Resolves to matched product details
   */
  getProductById: async (id) => {
    try {
      const res = await productService.getProductById(id);
      if (res && (res._id || res.id)) {
        return res;
      }
    } catch (error) {
      console.warn("API getProductById Error, falling back to local dataset:", error?.message || error);
    }
    return localProducts.find(p => p.id === id || p._id === id) || localProducts[0];
  },

  /**
   * Newsletter signup
   * @param {string} email
   */
  subscribeNewsletter: async (email) => {
    console.log(`Newsletter subscription for: ${email}`);
    return { success: true, message: "Subscription successful!" };
  },

  /**
   * Order checkout handler
   * @param {Object} orderDetails
   */
  placeOrder: async (orderDetails) => {
    console.log("Submitting order to AVK E-commerce API...", orderDetails);
    return {
      success: true,
      orderId: `AVK-${Math.floor(100000 + Math.random() * 900000)}`,
      message: "Order placed successfully!"
    };
  }
};
