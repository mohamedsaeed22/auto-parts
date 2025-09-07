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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRegistrationComplete: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
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

  const login = (token: string, user: User) => {
    storage.setAuth({
      token,
      user: user as AuthData["user"], // Type conversion needed due to nullable fields
    });
    setUser(user);
  };

  const logout = () => {
    storage.removeAuth();
    setUser(null);
    router.push("/");
  };

  const updateUser = (updatedUser: User) => {
    storage.updateUser(updatedUser as AuthData["user"]);
    setUser(updatedUser);
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
