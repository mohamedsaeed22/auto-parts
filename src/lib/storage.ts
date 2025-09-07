// Storage utility for managing auth data in browser

// ... existing code ...

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
  // Remove the duplicate is_registration_complete field from root level
}

// ... existing code ...

const AUTH_STORAGE_KEY = "fal_parts_auth";
const REGISTRATION_CODE_KEY = "fal_parts_registration_code";
const PREVIOUS_PAGE_KEY = "fal_parts_previous_page";

export const storage = {
  // Store auth data
  setAuth: (authData: AuthData): void => {
    try {
      console.log("storage.setAuth called with:", authData);
      console.log("Token to store:", authData.token);

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      // Verify it was stored correctly
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      console.log("Raw stored data:", stored);
      const parsed = stored ? JSON.parse(stored) : null;
      console.log("Parsed stored data:", parsed);
      console.log("Stored token:", parsed?.token);

      // Dispatch custom event to notify components of auth data change
      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  },

  updateUser: (userData: AuthData["user"]): void => {
    try {
      const currentAuth = storage.getAuth();
      if (!currentAuth) {
        console.error("No existing auth data to update");
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

      console.log("Updating user data:", userData);
      console.log("Updated auth data:", updatedAuth);

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth));

      // Dispatch custom event to notify components of auth data change
      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      console.error("Error updating user data:", error);
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

      // Dispatch custom event to notify components of auth data change
      window.dispatchEvent(new Event("authChange"));
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
    return authData?.user?.is_registration_complete || false;
  },

  // Store registration code
  setRegistrationCode: (code: string): void => {
    try {
      localStorage.setItem(REGISTRATION_CODE_KEY, code);
    } catch (error) {
      console.error("Error storing registration code:", error);
    }
  },

  // Get registration code
  getRegistrationCode: (): string | null => {
    try {
      return localStorage.getItem(REGISTRATION_CODE_KEY);
    } catch (error) {
      console.error("Error retrieving registration code:", error);
      return null;
    }
  },

  // Clear registration code
  clearRegistrationCode: (): void => {
    try {
      localStorage.removeItem(REGISTRATION_CODE_KEY);
    } catch (error) {
      console.error("Error clearing registration code:", error);
    }
  },

  // Store previous page URL
  setPreviousPage: (url: string): void => {
    try {
      localStorage.setItem(PREVIOUS_PAGE_KEY, url);
    } catch (error) {
      console.error("Error storing previous page:", error);
    }
  },

  // Get previous page URL
  getPreviousPage: (): string | null => {
    try {
      return localStorage.getItem(PREVIOUS_PAGE_KEY);
    } catch (error) {
      console.error("Error retrieving previous page:", error);
      return null;
    }
  },

  // Clear previous page URL
  clearPreviousPage: (): void => {
    try {
      localStorage.removeItem(PREVIOUS_PAGE_KEY);
    } catch (error) {
      console.error("Error clearing previous page:", error);
    }
  },
};
