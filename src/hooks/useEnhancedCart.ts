import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { store } from "@/store";
import { useAuthContext } from "@/contexts/auth-context";
import {
  addToCart as addToCartAction,
  removeFromCart,
  updateQuantity,
  addMultipleToCart,
  clearCart,
  toggleCart,
  setCartOpen,
  setLoading,
  setError,
  setItemLoading,
} from "@/store/slices/cartSlice";
import {
  selectCartItems,
  selectCartTotal,
  selectCartTotalItems,
  selectCartIsOpen,
  selectCartLoading,
  selectCartLoadingItems,
  selectCartError,
  selectCartIsEmpty,
  selectIsItemLoading,
} from "@/store/selectors/cartSelectors";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useAddManyToCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} from "@/services/hooks";
import type { CartItem } from "@/store/slices/cartSlice";
import { showError, showSuccess } from "@/lib/toast";
import { CartSyncService } from "@/services/cartSyncService";
import { storage } from "@/lib/storage";

/**
 * Enhanced cart hook that manages both local storage and API synchronization
 *
 * Logic:
 * - If user is not logged in: All cart operations are stored in local storage only
 * - If user is logged in but registration incomplete: Cart operations stay in local storage
 * - If user is logged in and registration complete: Cart operations sync with API
 * - On login with complete registration: Sync local storage cart to API
 */
export const useEnhancedCart = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRegistrationComplete } = useAuthContext();

  // Redux state selectors
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const totalItems = useAppSelector(selectCartTotalItems);
  const isOpen = useAppSelector(selectCartIsOpen);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const isEmpty = useAppSelector(selectCartIsEmpty);

  // API hooks - only used when user is authenticated and registration complete
  // Also require a valid token in storage to avoid race conditions immediately after logout
  const hasToken = Boolean(storage.getAuth()?.token);
  const shouldUseAPI = isAuthenticated && isRegistrationComplete && hasToken;

  const { data: apiCart, refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !shouldUseAPI,
  });

  const [addToCartAPI] = useAddToCartMutation();
  const [addManyToCartAPI] = useAddManyToCartMutation();
  const [updateCartItemAPI] = useUpdateCartItemMutation();
  const [clearCartAPI] = useClearCartMutation();

  /**
   * Sync functions using the centralized service
   */
  const syncLocalCartToAPI = useCallback(async () => {
    return await CartSyncService.syncLocalCartToAPI();
  }, []);

  const syncAPICartToLocal = useCallback(async () => {
    return await CartSyncService.syncAPICartToLocal();
  }, []);

  /**
   * Effect to handle cart synchronization on authentication state changes
   * This ensures API cart is synced to local storage on page reload
   */
  useEffect(() => {
    const syncCartOnLoad = async () => {
      if (shouldUseAPI && apiCart?.data?.items) {
        // Always sync API cart to local storage when user is authenticated and registered
        // This ensures quantities and items are always in sync with the server
        try {
          await syncAPICartToLocal();
        } catch (error) {
          console.error("Failed to sync API cart to local on load:", error);
        }
      }
    };

    syncCartOnLoad();
  }, [shouldUseAPI, apiCart, syncAPICartToLocal]);

  /**
   * Effect to listen for cart sync completion events
   */
  useEffect(() => {
    const handleCartSyncComplete = async () => {
      if (shouldUseAPI) {
        try {
          await refetchCart();
          await syncAPICartToLocal();
        } catch (error) {
          console.error("Failed to refresh cart after sync:", error);
        }
      }
    };

    window.addEventListener("cartSyncComplete", handleCartSyncComplete);

    return () => {
      window.removeEventListener("cartSyncComplete", handleCartSyncComplete);
    };
  }, [shouldUseAPI, refetchCart, syncAPICartToLocal]);

  /**
   * Add item to cart
   */
  const addToCart = useCallback(
    async (item: Omit<CartItem, "quantity">) => {
      try {
        dispatch(setLoading(true));

        if (shouldUseAPI) {
          // Use API
          await addToCartAPI({
            product_id: item.id,
            quantity: 1,
          }).unwrap();
          showSuccess("Product added to cart");
        } else {
          // Use local storage only - always succeeds
          dispatch(addToCartAction(item));
          showSuccess("Product added to cart");
          return; // Exit early for localStorage operations
        }
      } catch (error) {
        // Only show error for API operations
        if (shouldUseAPI) {
          console.error("Failed to add to cart:", error);
          showError("Failed to add product to cart");
        } else {
          // For localStorage, still add the item even if there's an error
          dispatch(addToCartAction(item));
          showSuccess("Product added to cart");
        }
      } finally {
        dispatch(setLoading(false));
      }
    },
    [shouldUseAPI, addToCartAPI, dispatch]
  );

  /**
   * Update item quantity
   */
  const handleUpdateQuantity = useCallback(
    async (id: number, quantity: number) => {
      try {
        dispatch(setItemLoading({ id, loading: true }));

        if (shouldUseAPI) {
          // Use the product ID directly for the API call
          // The backend expects the product ID in the URL, not the cart item ID
          await updateCartItemAPI({
            id: id, // This is the product ID
            quantity,
          }).unwrap();
        } else {
          // Use local storage only - always succeeds
          dispatch(updateQuantity({ id, quantity }));
          return; // Exit early for localStorage operations
        }
      } catch (error) {
        // Only show error for API operations
        if (shouldUseAPI) {
          console.error("Failed to update quantity:", error);
          showError("Failed to update quantity");
        } else {
          // For localStorage, still update even if there's an error
          dispatch(updateQuantity({ id, quantity }));
        }
      } finally {
        dispatch(setItemLoading({ id, loading: false }));
      }
    },
    [shouldUseAPI, updateCartItemAPI, dispatch]
  );

  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = useCallback(
    async (id: number) => {
      try {
        dispatch(setItemLoading({ id, loading: true }));

        if (shouldUseAPI) {
          // Call update endpoint with quantity 0 to remove the product
          await updateCartItemAPI({ id, quantity: 0 }).unwrap();
          // Also update local state to keep it in sync
          dispatch(removeFromCart(id));
        } else {
          // Use local storage only - always succeeds
          dispatch(removeFromCart(id));
          return; // Exit early for localStorage operations
        }
      } catch (error) {
        // Only show error for API operations
        if (shouldUseAPI) {
          console.error("Failed to remove from cart:", error);
          // showError("Failed to remove product from cart");
        } else {
          // For localStorage, still remove even if there's an error
          dispatch(removeFromCart(id));
        }
      } finally {
        dispatch(setItemLoading({ id, loading: false }));
      }
    },
    [shouldUseAPI, updateCartItemAPI, dispatch]
  );

  /**
   * Clear entire cart
   */
  const handleClearCart = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      if (shouldUseAPI) {
        await clearCartAPI().unwrap();
      } else {
        dispatch(clearCart());
      }

      showSuccess("Cart cleared successfully");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      showError("Failed to clear cart");
    } finally {
      dispatch(setLoading(false));
    }
  }, [shouldUseAPI, clearCartAPI, dispatch]);

  /**
   * Toggle cart visibility
   */
  const handleToggleCart = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  /**
   * Set cart open state
   */
  const handleSetCartOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setCartOpen(isOpen));
    },
    [dispatch]
  );

  /**
   * Check if a specific item is loading
   */
  const isItemLoading = useCallback((id: number) => {
    const state = store.getState();
    return selectIsItemLoading(id)(state);
  }, []);

  /**
   * Set loading state
   */
  const handleSetLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  /**
   * Set error state
   */
  const handleSetError = useCallback(
    (error: string | null) => {
      dispatch(setError(error));
    },
    [dispatch]
  );

  /**
   * Force refresh cart data
   */
  const refreshCart = useCallback(async () => {
    if (shouldUseAPI) {
      await refetchCart();
    }
  }, [shouldUseAPI, refetchCart]);

  return {
    // State
    items, // Always use local items as they are synced from API when needed
    total: shouldUseAPI ? apiCart?.data?.total || 0 : total,
    totalItems: shouldUseAPI ? apiCart?.data?.items?.length || 0 : totalItems,
    isOpen,
    loading,
    error,
    isEmpty: shouldUseAPI ? (apiCart?.data?.items?.length || 0) === 0 : isEmpty,

    // Authentication state
    isAuthenticated,
    isRegistrationComplete,
    shouldUseAPI,

    // Actions
    addToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    toggleCart: handleToggleCart,
    setCartOpen: handleSetCartOpen,
    setLoading: handleSetLoading,
    setError: handleSetError,
    isItemLoading,

    // Sync functions
    syncLocalCartToAPI,
    syncAPICartToLocal,
    refreshCart,
  };
};