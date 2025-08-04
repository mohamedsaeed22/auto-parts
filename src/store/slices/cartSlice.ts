import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  totalItems: number;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, totalItems };
};

const initialState: CartState = {
  items: [],
  total: 0,
  totalItems: 0,
  isOpen: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.totalItems = totals.totalItems;
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.totalItems = totals.totalItems;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== item.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.totalItems = totals.totalItems;
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalItems = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    addMultipleToCart: (state, action: PayloadAction<CartItem[]>) => {
      action.payload.forEach((newItem) => {
        const existing = state.items.find((i) => i.id === newItem.id);
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      });
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.totalItems = totals.totalItems;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  setLoading,
  setError,
  addMultipleToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
