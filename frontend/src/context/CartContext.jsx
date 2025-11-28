import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { isAuthError } from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch cart';
      setError({
        message: errorMessage,
        isAuthError: isAuthError(err),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.addToCart(productId, quantity);
      setCart(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      if (isAuthError(err)) {
        setError({
          message: errorMessage,
          isAuthError: true,
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.removeFromCart(productId);
      setCart(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
      if (isAuthError(err)) {
        setError({
          message: errorMessage,
          isAuthError: true,
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, loading, error, fetchCart, addToCart, removeFromCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
