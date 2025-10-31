import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../api/services';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to parse wishlist:', err);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Load wishlist from server on mount
    (async () => {
      try {
        const res = await getWishlist();
        if (res && res.success && res.data) {
          let items = [];
          if (Array.isArray(res.data)) {
            items = res.data;
          } else if (Array.isArray(res.data.items)) {
            items = res.data.items;
          } else if (Array.isArray(res.data.data)) {
            items = res.data.data;
          }
          
          // Normalize to array of product IDs or product objects
          const normalized = items.map((item) => {
            if (typeof item === 'number' || typeof item === 'string') {
              return item; // Just IDs
            }
            return item.product_id || item.id || item;
          });
          
          if (normalized.length > 0) {
            setWishlistItems(normalized);
          }
        }
      } catch (err) {
        console.log('Could not load server wishlist, using localStorage');
      }
    })();
  }, []);

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (productId) => {
    // Optimistically add
    setWishlistItems((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });

    try {
      const res = await apiAddToWishlist(productId);
      
      if (res && res.success) {
        toast.success(res.message || 'Added to wishlist');
      } else {
        // Revert on failure
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        
        // Handle error display
        let errorMsg = 'Failed to add to wishlist';
        if (res?.error) {
          if (Array.isArray(res.error)) {
            errorMsg = res.error.filter(Boolean).join(' ');
          } else {
            errorMsg = res.error;
          }
        } else if (res?.message) {
          errorMsg = res.message;
        }
        
        toast.error(errorMsg);
      }
      
      return res;
    } catch (err) {
      // Revert on error
      setWishlistItems((prev) => prev.filter((id) => id !== productId));
      toast.error(err?.message || 'Failed to add to wishlist');
      return { success: 0, error: err?.message || String(err) };
    }
  };

  const removeFromWishlist = async (productId) => {
    // Optimistically remove
    const backup = wishlistItems;
    setWishlistItems((prev) => prev.filter((id) => id !== productId));

    try {
      const res = await apiRemoveFromWishlist(productId);
      
      if (res && res.success) {
        toast.success(res.message || 'Removed from wishlist');
      } else {
        // Revert on failure
        setWishlistItems(backup);
        const errorMsg = res?.error || res?.message || 'Failed to remove from wishlist';
        if (Array.isArray(res?.error)) {
          toast.error(res.error.filter(Boolean).join(' '));
        } else {
          toast.error(errorMsg);
        }
      }
      
      return res;
    } catch (err) {
      // Revert on error
      setWishlistItems(backup);
      toast.error(err?.message || 'Failed to remove from wishlist');
      return { success: 0, error: err?.message || String(err) };
    }
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
