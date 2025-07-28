// context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate cart total whenever cartItems change
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('CartProvider: Loading cart from localStorage...');
    
    try {
      const stored = localStorage.getItem('cartItems');
      console.log('CartProvider: Raw localStorage data:', stored);
      
      if (stored) {
        const parsedItems = JSON.parse(stored);
        console.log('CartProvider: Parsed items:', parsedItems);
        
        if (Array.isArray(parsedItems)) {
          setCartItems(parsedItems);
          console.log('CartProvider: Cart items set:', parsedItems);
        } else {
          console.warn('CartProvider: Invalid cart data, resetting');
          setCartItems([]);
        }
      } else {
        console.log('CartProvider: No cart data in localStorage');
        setCartItems([]);
      }
    } catch (error) {
      console.error('CartProvider: Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
      console.log('CartProvider: Loading complete');
    }
  }, []);

  // Sync to localStorage whenever cartItems change (but not on initial load)
  useEffect(() => {
    if (!loading) {
      console.log('CartProvider: Saving cart to localStorage:', cartItems);
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('CartProvider: Error saving cart:', error);
      }
    }
  }, [cartItems, loading]);

  const addToCart = (product) => {
    console.log('CartProvider: Adding to cart:', product);
    
    if (!product || !product._id) {
      console.error('CartProvider: Invalid product data:', product);
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      let newItems;
      
      if (exists) {
        newItems = prev.map((item) =>
          item._id === product._id 
            ? { ...item, qty: item.qty + (product.qty || 1) }
            : item
        );
      } else {
        const cartItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: product.qty || 1,
          brand: product.brand,
          category: product.category,
        };
        newItems = [...prev, cartItem];
      }
      
      console.log('CartProvider: New cart items:', newItems);
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    console.log('CartProvider: Removing from cart:', id);
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQty = (id, qty) => {
    console.log('CartProvider: Updating quantity:', id, qty);
    
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: parseInt(qty) } : item
      )
    );
  };

  const clearCart = () => {
    console.log('CartProvider: Clearing cart');
    setCartItems([]);
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('CartProvider: Error clearing cart:', error);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item._id === productId);
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    isInCart,
    getCartItem
  };

  console.log('CartProvider: Providing context with:', {
    cartItemsLength: cartItems.length,
    loading,
    cartItems: cartItems
  });

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;