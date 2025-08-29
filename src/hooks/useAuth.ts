import { useState, useEffect } from "react";
import { storage, type AuthData } from "@/lib/storage";

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

  const logout = () => {
    storage.removeAuth();
    setIsAuthenticated(false);
    setUser(null);
    setAuthData(null);

    // Dispatch custom event
    window.dispatchEvent(new Event("authChange"));
  };

  const login = (authData: AuthData) => {
    storage.setAuth(authData);
    setIsAuthenticated(true);
    setUser(authData.user);
    setAuthData(authData);

    // Dispatch custom event
    window.dispatchEvent(new Event("authChange"));
  };

  return {
    isAuthenticated,
    user,
    authData,
    logout,
    login,
  };
}
