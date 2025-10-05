import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "@/services/api/cartApi";
import type { RootState } from "@/store";
import type { ApiResponse, Cart } from "@/services/api/types";
import { CartSyncService } from "@/services/cartSyncService";
import { PURGE } from "redux-persist";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  description?: string;
  stock?: number; // Add stock information to cart items
}

interface CartState {
  items: CartItem[];
  total: number;
  totalItems: number;
  isOpen: boolean;
  loading: boolean;
  loadingItems: number[]; // Track which items are currently loading
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
  loadingItems: [],
  error: null,
};

// Helper to map API cart response into local CartItem[]
type ApiCartItem = {
  product: {
    id: number;
    name: string;
    final_price?: number | string;
    price?: number | string;
    primary_image?: string;
    category?: { name?: string } | null;
    description?: string;
    stock?: number;
  };
  quantity: number;
};

const mapApiCartToItems = (
  apiCart: Cart | { cart_items?: ApiCartItem[] } | undefined
): CartItem[] => {
  const items = (apiCart as { cart_items?: ApiCartItem[] } | undefined)
    ?.cart_items;
  if (!items) return [];
  return items.map((item: ApiCartItem) => ({
    id: item.product.id,
    title: item.product.name,
    price:
      Number(item.product?.final_price) || Number(item.product?.price) || 0,
    image: item.product?.primary_image || "",
    quantity: item.quantity,
    category: item.product?.category?.name || "Unknown Category",
    description: item.product?.description || "",
    stock: item.product?.stock,
  }));
};

// Async thunks
export const syncCartOnLogin = createAsyncThunk<
  CartItem[],
  { isRegistrationComplete: boolean },
  { state: RootState }
>("cart/syncCartOnLogin", async ({ isRegistrationComplete }, thunkAPI) => {
  await CartSyncService.handleLoginSync(isRegistrationComplete);
  const response = (await thunkAPI
    .dispatch(cartApi.endpoints.getCart.initiate())
    .unwrap()) as ApiResponse<Cart>;
  return mapApiCartToItems(response.data);
});

export const addToCartAPI = createAsyncThunk<
  CartItem[],
  { productId: number; quantity?: number }
>("cart/addToCartAPI", async ({ productId, quantity = 1 }, thunkAPI) => {
  const res = (await thunkAPI
    .dispatch(
      cartApi.endpoints.addToCart.initiate({ product_id: productId, quantity })
    )
    .unwrap()) as ApiResponse<Cart>;
  return mapApiCartToItems(res.data);
});

export const addManyToCartAPI = createAsyncThunk<
  CartItem[],
  { productIds: number[]; quantities: number[] }
>("cart/addManyToCartAPI", async ({ productIds, quantities }, thunkAPI) => {
  const res = (await thunkAPI
    .dispatch(
      cartApi.endpoints.addManyToCart.initiate({
        product_ids: productIds,
        quantities,
      })
    )
    .unwrap()) as ApiResponse<Cart>;
  return mapApiCartToItems(res.data);
});

export const updateCartAPI = createAsyncThunk<
  CartItem[],
  { productId: number; quantity: number }
>("cart/updateCartAPI", async ({ productId, quantity }, thunkAPI) => {
  const res = (await thunkAPI
    .dispatch(
      cartApi.endpoints.updateCartItem.initiate({ id: productId, quantity })
    )
    .unwrap()) as ApiResponse<Cart>;
  return mapApiCartToItems(res.data);
});

export const removeFromCartAPI = createAsyncThunk<
  CartItem[],
  { productId: number }
>("cart/removeFromCartAPI", async ({ productId }, thunkAPI) => {
  const res = (await thunkAPI
    .dispatch(
      cartApi.endpoints.updateCartItem.initiate({ id: productId, quantity: 0 })
    )
    .unwrap()) as ApiResponse<Cart>;
  return mapApiCartToItems(res.data);
});

export const clearCartAPI = createAsyncThunk<CartItem[], void>(
  "cart/clearCartAPI",
  async (_, thunkAPI) => {
    await thunkAPI.dispatch(cartApi.endpoints.clearCart.initiate()).unwrap();
    return [];
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.totalItems = totals.totalItems;
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
        // Update stock information if provided
        if (action.payload.stock !== undefined) {
          existing.stock = action.payload.stock;
        }
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

    setItemLoading: (
      state,
      action: PayloadAction<{ id: number; loading: boolean }>
    ) => {
      const { id, loading } = action.payload;
      if (loading) {
        if (!state.loadingItems.includes(id)) {
          state.loadingItems.push(id);
        }
      } else {
        state.loadingItems = state.loadingItems.filter(
          (itemId) => itemId !== id
        );
      }
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
  extraReducers: (builder) => {
    builder
      .addCase(syncCartOnLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCartOnLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalItems = totals.totalItems;
      })
      .addCase(syncCartOnLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "errors.syncFailed";
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalItems = totals.totalItems;
      })
      .addCase(addManyToCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalItems = totals.totalItems;
      })
      .addCase(updateCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalItems = totals.totalItems;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalItems = totals.totalItems;
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.totalItems = 0;
      })
      // Handle PURGE action to reset state when logging out
      .addCase(PURGE, () => {
        return initialState;
      });
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  setLoading,
  setError,
  setItemLoading,
  addMultipleToCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export type { CartState };
