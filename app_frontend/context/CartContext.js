// components/cartContext.js
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  // Load cart from localStorage only on client-side after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
      setHasMounted(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, hasMounted]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(p => p.product_id === product.product_id);
      if (exists) {
        return prev.map(p =>
          p.product_id === product.product_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        // Explicitly include all needed fields
        return [...prev, { 
          product_id: product.product_id,
          name: product.product_name,
          price: product.price,
          category: product.category, // <-- Ensure category is included
          img_url: product.img_url,  // <-- Include any other needed fields
          quantity: 1 
        }];
      }
    });
  };

  const removeFromCart = (product_id) => {
    setCart((prev) => prev.filter(item => item.product_id !== product_id));
  };

  const updateQuantity = (product_id, quantity) => {
    setCart((prev) =>
      prev.map(item =>
        item.product_id === product_id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {hasMounted ? children : null}
    </CartContext.Provider>
  );
};
