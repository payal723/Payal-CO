import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product, CartItem, User } from '@/types';
import { toast } from 'sonner';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected product for detail
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nexora_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexora_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexora_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('nexora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexora_user');
    }
  }, [user]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        toast.success(`Updated quantity for ${product.name}`);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    toast.info('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    toast.info('Cart cleared');
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.info('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      }
      toast.success('Added to wishlist');
      return [...prev, productId];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const login = useCallback((email: string, password: string) => {
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
    };
    setUser(mockUser);
    toast.success('Welcome back!');
    return true;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    const mockUser: User = {
      id: '1',
      name,
      email,
    };
    setUser(mockUser);
    toast.success('Account created successfully!');
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.info('Logged out successfully');
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        login,
        register,
        logout,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
