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

const initialState: CartState = {
  items: [],
  total: 0,
  totalItems: 0,
  isOpen: false,
  loading: false,
  error: null,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, totalItems };
};

// Rename the function to avoid conflict
const initializeCartFromStorage = (): CartState => {
  if (typeof window === "undefined") return initialState;

  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      return {
        ...parsedCart,
        isOpen: false,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return initialState;
};

const saveCartToStorage = (cart: CartState) => {
  if (typeof window === "undefined") return;

  try {
    const cartToSave = {
      items: cart.items,
      total: cart.total,
      totalItems: cart.totalItems,
    };
    localStorage.setItem("cart", JSON.stringify(cartToSave));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initializeCartFromStorage(), // Use the renamed function
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      const { total, totalItems } = calculateTotals(state.items);
      state.total = total;
      state.totalItems = totalItems;
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const { total, totalItems } = calculateTotals(state.items);
      state.total = total;
      state.totalItems = totalItems;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }

      const { total, totalItems } = calculateTotals(state.items);
      state.total = total;
      state.totalItems = totalItems;
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

    // Bulk operations
    addMultipleToCart: (state, action: PayloadAction<CartItem[]>) => {
      action.payload.forEach((item) => {
        const existingItem = state.items.find(
          (cartItem) => cartItem.id === item.id
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          state.items.push(item);
        }
      });

      const { total, totalItems } = calculateTotals(state.items);
      state.total = total;
      state.totalItems = totalItems;
    },

    // Keep the action name as is
    loadCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const { total, totalItems } = calculateTotals(state.items);
      state.total = total;
      state.totalItems = totalItems;
    },
  },
  // Add extraReducers to handle persistence actions
  extraReducers: (builder) => {
    builder.addCase("persist/REHYDRATE", (state, action: any) => {
      if (action.payload?.cart) {
        // Ensure totals are recalculated after rehydration
        const { total, totalItems } = calculateTotals(
          action.payload.cart.items || []
        );
        state.items = action.payload.cart.items || [];
        state.total = total;
        state.totalItems = totalItems;
        // Don't override isOpen state from persistence
        state.isOpen = action.payload.cart.isOpen || false;
      }
    });
  },
});

// Add middleware to save cart on every state change
export const cartMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  if (action.type?.startsWith("cart/")) {
    const cartState = store.getState().cart;
    saveCartToStorage(cartState);
  }

  return result;
};

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
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
