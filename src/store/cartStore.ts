import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

interface CartActions {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMultipleToCart: (items: CartItem[]) => void;
}

type CartStore = CartState & CartActions;

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, totalItems };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      total: 0,
      totalItems: 0,
      isOpen: false,
      loading: false,
      error: null,

      // Actions
      addToCart: (newItem) => {
        const state = get();
        const existingItem = state.items.find((item) => item.id === newItem.id);

        let updatedItems: CartItem[];

        if (existingItem) {
          updatedItems = state.items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [...state.items, { ...newItem, quantity: 1 }];
        }

        const { total, totalItems } = calculateTotals(updatedItems);

        set({
          items: updatedItems,
          total,
          totalItems,
        });
      },

      removeFromCart: (id) => {
        const state = get();
        const updatedItems = state.items.filter((item) => item.id !== id);
        const { total, totalItems } = calculateTotals(updatedItems);

        set({
          items: updatedItems,
          total,
          totalItems,
        });
      },

      updateQuantity: (id, quantity) => {
        const state = get();

        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          const updatedItems = state.items.filter((item) => item.id !== id);
          const { total, totalItems } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            total,
            totalItems,
          });
        } else {
          // Update quantity
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          const { total, totalItems } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            total,
            totalItems,
          });
        }
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          totalItems: 0,
        });
      },

      toggleCart: () => {
        set((state) => ({
          isOpen: !state.isOpen,
        }));
      },

      setCartOpen: (isOpen) => {
        set({ isOpen });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      addMultipleToCart: (newItems) => {
        const state = get();
        const updatedItems = [...state.items];

        newItems.forEach((newItem) => {
          const existingItemIndex = updatedItems.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex >= 0) {
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + newItem.quantity,
            };
          } else {
            updatedItems.push(newItem);
          }
        });

        const { total, totalItems } = calculateTotals(updatedItems);

        set({
          items: updatedItems,
          total,
          totalItems,
        });
      },
    }),
    {
      name: "cart-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, total, and totalItems
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        totalItems: state.totalItems,
      }),
      // Don't persist UI state like isOpen, loading, error
      skipHydration: false,
    }
  )
);
