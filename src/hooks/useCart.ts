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
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (id: number) => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const handleUpdateQuantity = useCallback(
    (id: number, quantity: number) => {
      dispatch(updateQuantity({ id, quantity }));
    },
    [dispatch]
  );

  const handleAddMultipleToCart = useCallback(
    (items: CartItem[]) => {
      dispatch(addMultipleToCart(items));
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

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
