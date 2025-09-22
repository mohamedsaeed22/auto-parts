import { useState, useEffect } from "react";
import { storage, type AuthData } from "@/lib/storage";
import { store, persistor } from "@/store";
import { clearCart, setCartOpen } from "@/store/slices/cartSlice";
import { api } from "@/services/api";
import { getCurrentLocale } from "@/lib/localeService";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    storage.isAuthenticated()
  );
  const [user, setUser] = useState(storage.getUser());
  const [authData, setAuthData] = useState<AuthData | null>(storage.getAuth());

  useEffect(() => {
    const checkAuth = () => {
      const currentAuth = storage.isAuthenticated();
      const currentUser = storage.getUser();
      const currentAuthData = storage.getAuth();

      setIsAuthenticated(currentAuth);
      setUser(currentUser);
      setAuthData(currentAuthData);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fal_parts_auth" || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for auth changes within the same tab
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const logout = async () => {
    // Clear Redux state first so UI updates immediately
    store.dispatch(clearCart());
    store.dispatch(setCartOpen(false));
    store.dispatch(api.util.resetApiState());

    // Purge persisted storage
    try {
      await persistor.purge();
      await persistor.flush();
    } catch (e) {
      // ignore
    }

    // Remove auth and update local hook state
    storage.removeAuth();
    setIsAuthenticated(false);
    setUser(null);
    setAuthData(null);
  };

  const login = async (authData: AuthData) => {
    storage.setAuth(authData);

    // Verify storage worked
    const storedAuth = storage.getAuth();

    setIsAuthenticated(true);
    setUser(authData.user);
    setAuthData(authData);

    // Auto-sync user's language preference with current app locale
    try {
      const currentAppLocale = getCurrentLocale();
      console.log(
        "useAuth - Auto-syncing language on login:",
        currentAppLocale
      );

      // Dispatch the changeLanguage mutation to update backend
      await store
        .dispatch(
          api.endpoints.changeLanguage.initiate({
            locale: currentAppLocale as "ar" | "en",
          })
        )
        .unwrap();

      console.log("useAuth - Language synced successfully on login");
    } catch (error) {
      console.error("useAuth - Failed to sync language on login:", error);
      // Don't block login if language sync fails
    }
  };

  return {
    isAuthenticated,
    user,
    authData,
    logout,
    login,
  };
}
