// Storage utility for managing auth data in browser

// ... existing code ...

export interface AuthData {
  token: string;
  user: {
    id: number;
    code: string;
    name: string | null;
    email: string | null;
    phone: string;
    type: string | null;
    points: number;
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
}

// ... existing code ...

const AUTH_STORAGE_KEY = "fal_parts_auth";
const REGISTRATION_CODE_KEY = "fal_parts_registration_code";
const PREVIOUS_PAGE_KEY = "fal_parts_previous_page";

export const storage = {
  // Store auth data
  setAuth: (authData: AuthData): void => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      // Dispatch custom event to notify components of auth data change
      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      // Error storing auth data
    }
  },

  updateUser: (userData: AuthData["user"]): void => {
    try {
      const currentAuth = storage.getAuth();
      if (!currentAuth) {
        return;
      }

      // Update only the user object and is_registration_complete
      const updatedAuth: AuthData = {
        ...currentAuth,
        user: {
          ...currentAuth.user,
          ...userData,
        },
        // Remove the duplicate is_registration_complete from root level
        // Use only the one inside user object
      };

      // Remove the duplicate field from root level
      delete (updatedAuth as unknown as Record<string, unknown>)
        .is_registration_complete;

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth));

      // Dispatch custom event to notify components of auth data change
      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      // Error updating user data
    }
  },

  // Get auth data
  getAuth: (): AuthData | null => {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      return null;
    }
  },

  // Remove auth data (logout)
  removeAuth: (): void => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);

      // Dispatch custom event to notify components of auth data change
      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      // Error removing auth data
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
    return authData?.user?.is_registration_complete || false;
  },

  // Store registration code
  setRegistrationCode: (code: string): void => {
    try {
      localStorage.setItem(REGISTRATION_CODE_KEY, code);
    } catch (error) {
      // Error storing registration code
    }
  },

  // Get registration code
  getRegistrationCode: (): string | null => {
    try {
      return localStorage.getItem(REGISTRATION_CODE_KEY);
    } catch (error) {
      return null;
    }
  },

  // Clear registration code
  clearRegistrationCode: (): void => {
    try {
      localStorage.removeItem(REGISTRATION_CODE_KEY);
    } catch (error) {
      // Error clearing registration code
    }
  },

  // Store previous page URL
  setPreviousPage: (url: string): void => {
    try {
      localStorage.setItem(PREVIOUS_PAGE_KEY, url);
    } catch (error) {
      // Error storing previous page
    }
  },

  // Get previous page URL
  getPreviousPage: (): string | null => {
    try {
      return localStorage.getItem(PREVIOUS_PAGE_KEY);
    } catch (error) {
      return null;
    }
  },

  // Clear previous page URL
  clearPreviousPage: (): void => {
    try {
      localStorage.removeItem(PREVIOUS_PAGE_KEY);
    } catch (error) {
      // Error clearing previous page
    }
  },
};
