import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage on app start
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, storeId, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.storeId === storeId
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id && item.storeId === storeId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, storeId, quantity }];
      }
    });
  };

  const removeFromCart = (productId, storeId) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.product.id === productId && item.storeId === storeId)
      )
    );
  };

  const updateQuantity = (productId, storeId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, storeId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && item.storeId === storeId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItemsByStore = () => {
    const storeGroups = {};
    cartItems.forEach(item => {
      if (!storeGroups[item.storeId]) {
        storeGroups[item.storeId] = [];
      }
      storeGroups[item.storeId].push(item);
    });
    return storeGroups;
  };

  const getStoreItemsCount = (storeId) => {
    return cartItems
      .filter(item => String(item.storeId) === String(storeId))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getQuantityForProduct = (productId, storeId) => {
    const item = cartItems.find(
      i => i.product.id === productId && String(i.storeId) === String(storeId)
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartItemsByStore,
    getStoreItemsCount,
    getQuantityForProduct
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
