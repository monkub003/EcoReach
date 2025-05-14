// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check login status only on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_access');
      setIsLoggedIn(!!token);
      setLoading(false);
    }
  }, []);

  // Fetch cart data when login status changes
  useEffect(() => {
    if (isLoggedIn && !loading) {
      fetchCartData();
    }
  }, [isLoggedIn, loading]);

  const login = (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_access', token);
      setIsLoggedIn(true);
      // Fetch cart data after login
      fetchCartData();
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_access');
      setUserData(null);
      setCartData(null);
      setIsLoggedIn(false);
      router.push('/login'); // Optional: redirect to login page
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_access');
    }
    return null;
  };

  const fetchUserData = async () => {
    if (!isLoggedIn) return null;
    try {
      const token = getToken();
      const response = await fetch('https://ecoreachdb-api.onrender.com/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return null;
        }
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const fetchCartData = async () => {
    if (!isLoggedIn) return null;
    
    setCartLoading(true);
    try {
      const token = getToken();
      const response = await fetch('https://ecoreachdb-api.onrender.com/api/carts/current/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return null;
        }
        throw new Error('Failed to fetch cart data');
      }
      
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return null;
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn) {
      router.push('/login');
      return null;
    }
    
    try {
      const token = getToken();
      const response = await fetch('https://ecoreachdb-api.onrender.com/api/carts/add_item/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return null;
        }
        throw new Error('Failed to add item to cart');
      }
      
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isLoggedIn) return null;
    
    try {
      const token = getToken();
      const response = await fetch('https://ecoreachdb-api.onrender.com/api/carts/remove_item/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: itemId })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return null;
        }
        throw new Error('Failed to remove item from cart');
      }
      
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (!isLoggedIn) return null;
    
    try {
      const token = getToken();
      const response = await fetch('https://ecoreachdb-api.onrender.com/api/carts/update_quantity/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: itemId, quantity })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return null;
        }
        throw new Error('Failed to update cart item quantity');
      }
      
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return null;
    }
  };

  return {
    isLoggedIn,
    loading,
    login,
    logout,
    getToken,
    userData,
    fetchUserData,
    cartData,
    cartLoading,
    fetchCartData,
    addToCart,
    removeFromCart,
    updateCartItemQuantity
  };
}

export default useAuth;