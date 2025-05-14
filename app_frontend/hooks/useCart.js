// hooks/useCart.js
import { useState, useEffect } from 'react';
import useAuth from './useAuth';

export function useCart() {
  const { isLoggedIn, loading: authLoading, getToken } = useAuth();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://ecoreachdb-frontend.onrender.com/api';

  // Helper function to make authenticated API requests
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include' // Include cookies for session-based cart for guests
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Load cart data - works for both logged in and guest users
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`${API_URL}/carts/current/`);
      setCart(data);
      return data;
    } catch (err) {
      console.error('Error fetching cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on initial load and when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [isLoggedIn, authLoading]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`${API_URL}/carts/add_item/`, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity })
      });
      setCart(data);
      return data;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`${API_URL}/carts/remove_item/`, {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId })
      });
      setCart(data);
      return data;
    } catch (err) {
      console.error('Error removing from cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    setLoading(true);
    try {
      const data = await fetchWithAuth(`${API_URL}/carts/update_quantity/`, {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId, quantity })
      });
      setCart(data);
      return data;
    } catch (err) {
      console.error('Error updating quantity:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading: loading || authLoading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity
  };
}

export default useCart;