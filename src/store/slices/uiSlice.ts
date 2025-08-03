import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  // Remove cart-related state since it's now in cartSlice
  // Add other UI state as needed
  isLoading: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  isLoading: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setLoading, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
