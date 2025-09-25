"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { storage, AuthData } from "@/lib/storage";
import { User } from "@/services/api/auth";
import { CartSyncService } from "@/services/cartSyncService";
import { persistor, store } from "@/store";
import { clearCart, setCartOpen } from "@/store/slices/cartSlice";
import { getCurrentLocale } from "@/lib/localeService";
import { api } from "@/services/api";
import { PURGE } from "redux-persist";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRegistrationComplete: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const checkAuth = () => {
      const storedUser = storage.getUser();
      if (storedUser) {
        setUser(storedUser as User);
      } else {
        setUser(null);
      }
    };

    checkAuth();
    setIsLoading(false);

    // Listen for auth changes to update state reactively
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const login = async (token: string, user: User) => {
    storage.setAuth({
      token,
      user: user as AuthData["user"], // Type conversion needed due to nullable fields
    });
    setUser(user);

    // Handle cart synchronization after login
    try {
      await CartSyncService.handleLoginSync(
        user.is_registration_complete ?? false
      );
      // Force a small delay to ensure state updates are processed
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("cartSyncComplete"));
      }, 100);
    } catch (error) {
      // The quantity of the products has been adjusted due to their depletion from stock. on login
    }

    // Auto-sync user's language preference with current app locale
    try {
      const currentAppLocale = getCurrentLocale();

      // Dispatch the changeLanguage mutation to update backend
      await store
        .dispatch(
          api.endpoints.changeLanguage.initiate({
            locale: currentAppLocale as "ar" | "en",
          })
        )
        .unwrap();
    } catch (error) {
      // Don't block login if language sync fails
    }
  };

  const logout = async () => {
    // Clear cart data on logout
    try {
      // Clear Redux state FIRST to update UI immediately
      store.dispatch(clearCart());
      store.dispatch(setCartOpen(false));

      // Reset cached queries (e.g., cart) to avoid any stale data
      store.dispatch(api.util.resetApiState());

      // Dispatch PURGE action to the cart slice specifically
      store.dispatch({
        type: PURGE,
        key: "cart-storage",
        result: () => null,
      });

      // Clear backend cart
      await CartSyncService.clearAllCarts();

      // Purge localStorage AFTER clearing Redux state
      await persistor.purge();

      // Force persist to flush immediately
      await persistor.flush();
    } catch (error) {
      // Even if clearing fails, still clear the UI
      store.dispatch(clearCart());
      store.dispatch(setCartOpen(false));
      try {
        await persistor.purge();
      } catch (purgeError) {
        // Failed to purge persistor
      }
    }

    storage.removeAuth();
    setUser(null);
    // Don't redirect automatically - let components handle their own redirect logic
  };

  const updateUser = async (updatedUser: User) => {
    const wasRegistrationIncomplete = !user?.is_registration_complete;
    const isNowComplete = updatedUser.is_registration_complete;

    storage.updateUser(updatedUser as AuthData["user"]);
    setUser(updatedUser);

    // Handle cart synchronization when registration is completed
    if (wasRegistrationIncomplete && isNowComplete) {
      try {
        await CartSyncService.handleRegistrationComplete();
      } catch (error) {
        // The quantity of the products has been adjusted due to their depletion from stock. on registration completion
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isRegistrationComplete: user?.is_registration_complete ?? false,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
