import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/index.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
      return;
    }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.cart || { items: [], totalPrice: 0, totalItems: 0 });
    } catch {
      // silently fail - user might not be logged in yet
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const { data } = await cartAPI.add(productId, quantity);
    setCart(data.cart);
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    const { data } = await cartAPI.update(productId, quantity);
    setCart(data.cart);
  }, []);

  const removeItem = useCallback(async (productId) => {
    const { data } = await cartAPI.remove(productId);
    setCart(data.cart);
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setCart({ items: [], totalPrice: 0, totalItems: 0 });
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount: cart?.totalItems || 0,
      addToCart,
      updateItem,
      removeItem,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};