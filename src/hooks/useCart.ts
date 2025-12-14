import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  addMultipleToCart,
  clearCart,
  toggleCart,
  setCartOpen,
  setLoading,
  setError,
} from "@/store/slices/cartSlice";
import {
  addToCartAPI,
  updateCartAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "@/store/slices/cartSlice";
import { useAuthContext } from "@/contexts/auth-context";
import {
  selectCartItems,
  selectCartTotal,
  selectCartTotalItems,
  selectCartIsOpen,
  selectCartLoading,
  selectCartError,
  selectCartIsEmpty,
} from "@/store/selectors/cartSelectors";
import type { CartItem } from "@/store/slices/cartSlice";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuthContext();
  const shouldUseAPI = isAuthenticated;

  // Selectors
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const totalItems = useAppSelector(selectCartTotalItems);
  const isOpen = useAppSelector(selectCartIsOpen);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const isEmpty = useAppSelector(selectCartIsEmpty);

  // Actions
  const handleAddToCart = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      if (shouldUseAPI) {
        // optimistic: update locally first
        dispatch(addToCart(item));
        dispatch(addToCartAPI({ productId: item.id }));
      } else {
        dispatch(addToCart(item));
      }
    },
    [dispatch, shouldUseAPI]
  );

  const handleRemoveFromCart = useCallback(
    (id: number) => {
      if (shouldUseAPI) {
        dispatch(removeFromCart(id));
        dispatch(removeFromCartAPI({ productId: id }));
      } else {
        dispatch(removeFromCart(id));
      }
    },
    [dispatch, shouldUseAPI]
  );

  const handleUpdateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (shouldUseAPI) {
        dispatch(updateQuantity({ id, quantity }));
        dispatch(updateCartAPI({ productId: id, quantity }));
      } else {
        dispatch(updateQuantity({ id, quantity }));
      }
    },
    [dispatch, shouldUseAPI]
  );

  const handleAddMultipleToCart = useCallback(
    (items: CartItem[]) => {
      dispatch(addMultipleToCart(items));
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    if (shouldUseAPI) {
      dispatch(clearCart());
      dispatch(clearCartAPI());
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, shouldUseAPI]);

  const handleToggleCart = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const handleSetCartOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setCartOpen(isOpen));
    },
    [dispatch]
  );

  const handleSetLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const handleSetError = useCallback(
    (error: string | null) => {
      dispatch(setError(error));
    },
    [dispatch]
  );

  return {
    // State
    items,
    total,
    totalItems,
    isOpen,
    loading,
    error,
    isEmpty,
    // Actions
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    addMultipleToCart: handleAddMultipleToCart,
    clearCart: handleClearCart,
    toggleCart: handleToggleCart,
    setCartOpen: handleSetCartOpen,
    setLoading: handleSetLoading,
    setError: handleSetError,
  };
};
