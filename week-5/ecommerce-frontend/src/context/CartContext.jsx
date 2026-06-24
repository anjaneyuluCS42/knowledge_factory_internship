import { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import productService from '../services/productService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch cart items when user signs in, clear when user signs out
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!localStorage.getItem('token')) return;
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      
      if (data.cart) {
        // Fetch all product details in parallel
        const entries = Object.entries(data.cart);
        const itemPromises = entries.map(async ([productId, quantity]) => {
          try {
            const product = await productService.getProductById(parseInt(productId));
            return {
              ...product,
              cartQuantity: parseInt(quantity),
            };
          } catch (err) {
            console.error(`Failed to fetch product ${productId}`, err);
            return null;
          }
        });
        
        const items = (await Promise.all(itemPromises)).filter(item => item !== null);
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err.detail || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      setError(err.detail || 'Failed to add to cart');
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      await cartService.removeFromCart(productId);
      setCartItems(cartItems.filter(item => item.id !== productId));
    } catch (err) {
      setError(err.detail || 'Failed to remove from cart');
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        await cartService.updateQuantity(productId, quantity);
        await fetchCart();
      }
    } catch (err) {
      setError(err.detail || 'Failed to update quantity');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setCartItems([]);
    } catch (err) {
      setError(err.detail || 'Failed to clear cart');
      throw err;
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
