import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSubtotal, calculateTotalItems } from '../utils/calculateTotal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart state from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('avk_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      console.error("Failed to parse localStorage cart data:", e);
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('avk_cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Helper to trigger a toast message safely
   * @param {string} msg - Message to display
   */
  const triggerToast = (msg) => {
    setToastMessage(null); // Clear active toast first
    setTimeout(() => {
      setToastMessage(msg);
    }, 50);
  };

  /**
   * Adds an item to the cart
   * @param {Object} product - Product details
   * @param {number} quantity - Quantity to add
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        triggerToast(`Updated quantity of ${product.name} in your cart.`);
        return newCart;
      } else {
        triggerToast(`Added ${product.name} to your cart.`);
        // Only keep necessary fields in cart state to save space
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            images: product.images,
            category: product.category,
            material: product.material,
            quantity: quantity
          }
        ];
      }
    });
  };

  /**
   * Removes an item from the cart
   * @param {string} productId - ID of the product to remove
   */
  const removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    if (item) {
      triggerToast(`Removed ${item.name} from your cart.`);
    }
  };

  /**
   * Updates the quantity of a cart item
   * @param {string} productId - ID of the product
   * @param {number} quantity - New quantity value
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clears all items from the cart
   */
  const clearCart = () => {
    setCart([]);
  };

  const subtotal = calculateSubtotal(cart);
  const totalItems = calculateTotalItems(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
