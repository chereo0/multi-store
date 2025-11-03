import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import toast from "react-hot-toast";
import {
  addToCart as apiAddToCart,
  emptyCart as apiEmptyCart,
  removeFromCartAPI,
  updateCartAPI,
} from "../api/services";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize state from localStorage immediately
    const savedCart = localStorage.getItem("cart");
    console.log(
      "CartProvider: Initial state - savedCart from localStorage:",
      savedCart
    );
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log("CartProvider: Initial state - parsed cart:", parsed);
        return parsed;
      } catch (err) {
        console.warn("CartProvider: Failed to parse saved cart:", err);
        return [];
      }
    }
    return [];
  });
  const backupRef = useRef(null);

  useEffect(() => {
    // This effect now only runs once on mount for logging purposes
    // The actual cart loading happens in useState initializer above
    console.log("CartProvider mounted. Current cartItems:", cartItems);
    console.log("localStorage cart:", localStorage.getItem("cart"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    console.log("CartContext: Saving cart to localStorage:", cartItems);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, storeId, quantity = 1) => {
    // Keep backup for revert if server call fails
    backupRef.current = null;
    setCartItems((prev) => {
      backupRef.current = prev;
      const existingItem = prev.find(
        (item) => item.product.id === product.id && item.storeId === storeId
      );

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id && item.storeId === storeId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, storeId, quantity }];
      }
    });

    // Send to server (optimistic). Payload shape: { product_id, quantity, store_id }
    try {
      const payload = {
        product_id: product.id,
        quantity,
        store_id: storeId,
      };
      const res = await apiAddToCart(payload);
      console.log("addToCart: Server response:", res);

      // If server rejects the add (for example: different-store constraint), revert and surface message
      // Check for success being explicitly 0, false, or undefined
      const isSuccess = res && (res.success === 1 || res.success === true);

      if (!isSuccess) {
        setCartItems(backupRef.current || []);

        // Handle error - check if it's a multi-store conflict
        let message = "Could not add to cart";
        let isMultiStoreError = false;

        if (res?.error) {
          if (Array.isArray(res.error)) {
            // Server returned error as array (e.g., ["Your cart already contains..."])
            message = res.error.filter(Boolean).join(" ");
          } else if (typeof res.error === "string") {
            message = res.error;
          }

          // Check if this is a multi-store conflict
          if (
            message.toLowerCase().includes("cart already contains") ||
            message.toLowerCase().includes("different store")
          ) {
            isMultiStoreError = true;
          }
        } else if (res?.message) {
          message = res.message;
        }

        console.log(
          "addToCart: Error type:",
          isMultiStoreError ? "Multi-store conflict" : "General error"
        );

        // If it's a multi-store error, show confirmation dialog
        if (isMultiStoreError) {
          const confirmClear = window.confirm(
            `${message}\n\nWould you like to clear your current cart and add this item?`
          );

          if (confirmClear) {
            console.log("User confirmed: Clearing cart and adding new item");
            // Clear the cart first, then add the new item
            try {
              await clearCart();
              // Try adding again after clearing
              const retryRes = await apiAddToCart(payload);
              if (
                retryRes &&
                (retryRes.success === 1 || retryRes.success === true)
              ) {
                toast.success("Cart cleared and item added!");
                // Update local state with new item
                setCartItems([{ product, storeId, quantity }]);
                return retryRes;
              } else {
                toast.error("Failed to add item after clearing cart");
                return retryRes;
              }
            } catch (error) {
              console.error("Error clearing cart:", error);
              toast.error("Failed to clear cart");
              return { success: false, error: "Failed to clear cart" };
            }
          } else {
            console.log("User cancelled: Keeping existing cart");
            toast("Item not added. Current cart unchanged.", { icon: "ℹ️" });
            return { success: false, cancelled: true };
          }
        } else {
          // Show regular error
          console.log("addToCart: Showing error toast:", message);
          toast.error(message);
          console.warn("addToCart: server rejected the update", message);
          return res || { success: false, error: message };
        }
      }

      // Optionally sync from server response if it returns a canonical cart
      if (res.data && Array.isArray(res.data.items)) {
        const normalized = res.data.items.map((it) => {
          const productObj = it.product ||
            it.product_detail || {
              id: it.product_id || it.productId,
              name: it.name || it.title,
              price: it.price || it.unit_price,
              image:
                it.image || (it.product && it.product.image) || "/no-image.png",
            };
          const store = it.store_id || it.storeId || it.store;
          const qty = it.quantity || it.qty || it.count || 1;
          return { product: productObj, storeId: store, quantity: qty };
        });
        setCartItems(normalized);
      }

      // Return the successful response so callers can react
      return res;
    } catch (err) {
      // Revert optimistic update on network/error
      setCartItems(backupRef.current || []);
      const message =
        err?.message || String(err) || "Network error adding to cart";
      toast.error(message);
      console.warn("addToCart network error:", message);
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (productId, storeId) => {
    // Optimistically remove from local state
    const backup = cartItems;
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.storeId === storeId)
      )
    );

    // Call server to remove item (key is the product_id)
    try {
      const res = await removeFromCartAPI(productId);

      if (res && res.success) {
        toast.success(res.message || "Item removed from cart");
      } else {
        // Revert if server failed
        setCartItems(backup);
        const errorMsg = res?.error || res?.message || "Failed to remove item";
        if (Array.isArray(res?.error)) {
          toast.error(res.error.filter(Boolean).join(" "));
        } else {
          toast.error(errorMsg);
        }
      }

      return res;
    } catch (err) {
      // Revert on error
      setCartItems(backup);
      toast.error(err?.message || "Failed to remove item");
      return { success: 0, error: err?.message || String(err) };
    }
  };

  const updateQuantity = async (productId, storeId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, storeId);
      return;
    }

    // Optimistically update local state
    const backup = cartItems;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.storeId === storeId
          ? { ...item, quantity }
          : item
      )
    );

    // Call server to update quantity
    try {
      const payload = {
        key: productId, // Server expects 'key' not 'product_id'
        quantity,
      };

      const res = await updateCartAPI(payload);

      if (res && res.success) {
        // Optionally sync from server if it returns updated cart
        if (res.data && Array.isArray(res.data.items)) {
          const normalized = res.data.items.map((it) => {
            const productObj = it.product ||
              it.product_detail || {
                id: it.product_id || it.productId,
                name: it.name || it.title,
                price: it.price || it.unit_price,
                image:
                  it.image ||
                  (it.product && it.product.image) ||
                  "/no-image.png",
              };
            const store = it.store_id || it.storeId || it.store;
            const qty = it.quantity || it.qty || it.count || 1;
            return { product: productObj, storeId: store, quantity: qty };
          });
          setCartItems(normalized);
        }
      } else {
        // Revert if server failed
        setCartItems(backup);
        const errorMsg =
          res?.error || res?.message || "Failed to update quantity";
        if (Array.isArray(res?.error)) {
          toast.error(res.error.filter(Boolean).join(" "));
        } else {
          toast.error(errorMsg);
        }
      }

      return res;
    } catch (err) {
      // Revert on error
      setCartItems(backup);
      toast.error(err?.message || "Failed to update quantity");
      return { success: 0, error: err?.message || String(err) };
    }
  };

  const clearCart = async () => {
    try {
      // Call server to clear cart
      const res = await apiEmptyCart();

      // Clear local cart regardless of server response
      setCartItems([]);

      if (res && res.success) {
        toast.success(res.message || "Cart cleared");
      } else {
        console.warn("Server cart clear failed, but local cart cleared:", res);
      }

      return res;
    } catch (err) {
      // Still clear local cart even if server fails
      setCartItems([]);
      console.warn("clearCart error:", err);
      return { success: 0, error: err?.message || String(err) };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItemsByStore = () => {
    const storeGroups = {};
    cartItems.forEach((item) => {
      if (!storeGroups[item.storeId]) {
        storeGroups[item.storeId] = [];
      }
      storeGroups[item.storeId].push(item);
    });
    return storeGroups;
  };

  const getStoreItemsCount = (storeId) => {
    return cartItems
      .filter((item) => String(item.storeId) === String(storeId))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getQuantityForProduct = (productId, storeId) => {
    const item = cartItems.find(
      (i) => i.product.id === productId && String(i.storeId) === String(storeId)
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
    getQuantityForProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
