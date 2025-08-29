// Storage utility for managing auth data in browser

export interface AuthData {
  user: {
    id: number;
    code: string;
    name: string | null;
    email: string | null;
    phone: string;
    type: string | null;
    manager_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    tax_number: string | null;
    commercial_register: string | null;
    avatar: string | null;
    latitude: string | null;
    longitude: string | null;
    is_registration_complete: boolean;
    is_google_user: boolean;
  };
  token: string;
  is_registration_complete: boolean;
}

const AUTH_STORAGE_KEY = "fal_parts_auth";

export const storage = {
  // Store auth data
  setAuth: (authData: AuthData): void => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  },

  // Get auth data
  getAuth: (): AuthData | null => {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error("Error retrieving auth data:", error);
      return null;
    }
  },

  // Remove auth data (logout)
  removeAuth: (): void => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing auth data:", error);
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const authData = storage.getAuth();
    return !!(authData && authData.token);
  },

  // Get auth token
  getToken: (): string | null => {
    const authData = storage.getAuth();
    return authData?.token || null;
  },

  // Get user data
  getUser: () => {
    const authData = storage.getAuth();
    return authData?.user || null;
  },

  // Check if registration is complete
  isRegistrationComplete: (): boolean => {
    const authData = storage.getAuth();
    return authData?.is_registration_complete || false;
  },
};
