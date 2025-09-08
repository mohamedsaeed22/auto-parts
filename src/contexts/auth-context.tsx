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
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser as User);
    }
    setIsLoading(false);
  }, []);

  const login = async (token: string, user: User) => {
    storage.setAuth({
      token,
      user: user as AuthData["user"], // Type conversion needed due to nullable fields
    });
    setUser(user);
    
    // Handle cart synchronization after login
    try {
      await CartSyncService.handleLoginSync(user.is_registration_complete ?? false);
      // Force a small delay to ensure state updates are processed
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cartSyncComplete'));
      }, 100);
    } catch (error) {
      console.error("Failed to sync cart on login:", error);
    }
  };

  const logout = async () => {
    // Clear cart data on logout
    try {
      await CartSyncService.clearAllCarts();
    } catch (error) {
      console.error("Failed to clear carts on logout:", error);
    }
    
    storage.removeAuth();
    setUser(null);
    router.push("/");
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
        console.error("Failed to sync cart on registration completion:", error);
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
