import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import uiReducer from "./slices/uiSlice";
import cartReducer, { cartMiddleware } from "./slices/cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // Only persist cart state
  // Add blacklist for cart state properties we don't want to persist
  blacklist: ["cart.isOpen", "cart.loading", "cart.error"], // Don't persist UI state
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(cartMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
