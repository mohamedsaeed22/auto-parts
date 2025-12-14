import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Basic selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartLoadingItems = (state: RootState) => state.cart.loadingItems;
export const selectCartError = (state: RootState) => state.cart.error;

// Memoized selectors
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.length
);

export const selectCartItemById = (id: number) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.id === id)
  );

export const selectCartItemsByCategory = (category: string) =>
  createSelector([selectCartItems], (items) =>
    items.filter((item) => item.category === category)
  );

export const selectCartIsEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

export const selectIsItemLoading = (id: number) =>
  createSelector([selectCartLoadingItems], (loadingItems) =>
    loadingItems.includes(id)
  );
