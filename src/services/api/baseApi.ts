import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { storage } from "@/lib/storage";
import type { RegistrationIncompleteError } from "./types";
import { getCurrentLocale } from "@/lib/localeService";

// Base URL from your Postman collection
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Custom error type for registration incomplete
export interface RegistrationIncompleteErrorResponse {
  status: 403;
  data: RegistrationIncompleteError;
}

// Custom base query with auth token handling
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | RegistrationIncompleteErrorResponse
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from storage utility
      const token = storage.getToken();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      // Get current locale using localeService for consistency
      const currentLocale = getCurrentLocale();

      // Set locale header for ALL requests (both GET and non-GET)
      headers.set("locale", currentLocale);
      headers.set("Accept-Language", currentLocale);

      // Set default content type for form data requests
      if (typeof args === "object" && args.body instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it with boundary
        headers.delete("content-type");
      } else if (!headers.get("content-type")) {
        headers.set("content-type", "application/json");
      }

      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // Handle unauthorized responses (401)
  if (result.error && result.error.status === 401) {
    // Import store and persistor for complete cleanup
    const { store } = await import("@/store");
    const { persistor } = await import("@/store");
    const { clearCart, setCartOpen } = await import("@/store/slices/cartSlice");

    console.log("🔒 401 Unauthorized - Session expired, logging out user");

    try {
      // 1. Clear Redux state immediately for instant UI update
      store.dispatch(clearCart());
      store.dispatch(setCartOpen(false));

      // 2. Reset all API cache to prevent stale data
      // Note: API reset will be handled by the auth context when it receives the authChange event

      // 3. Clear backend cart - skip API call to prevent infinite loop
      try {
        const { CartSyncService } = await import("@/services/cartSyncService");
        // Pass skipApi=true to avoid calling the API (which would return 401 again)
        await CartSyncService.clearAllCarts(true);
      } catch {
        // Ignore cart clearing errors on 401
        console.log("Cart clearing failed during 401 logout (expected)");
      }

      // 4. Purge persisted storage
      await persistor.purge();
      await persistor.flush();

      // 5. Clear localStorage auth data
      storage.removeAuth();

      // 6. Clear other sensitive localStorage items
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("auto_parts_coupon_code");
          localStorage.removeItem("userProfileActivePage");
          // Add any other sensitive keys that should be cleared
        } catch {
          // Ignore localStorage clearing errors
        }
      }

      // 7. Dispatch auth change event for components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authChange"));

        // Store current page for redirect after re-login
        const currentPath = window.location.pathname;
        storage.setPreviousPage(currentPath);
      }

      console.log("✅ Session cleanup completed - User logged out due to 401");
    } catch (cleanupError) {
      console.error("❌ Error during 401 session cleanup:", cleanupError);

      // Fallback cleanup - at minimum clear auth and dispatch event
      storage.removeAuth();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authChange"));
      }
    }
  }

  // Handle registration incomplete responses (403)
  if (result.error && result.error.status === 403) {
    const errorData = result.error.data as RegistrationIncompleteError;

    if (errorData?.data?.is_registration_complete === false) {
      // Store the user code for registration completion
      if (errorData.data.user?.code) {
        storage.setRegistrationCode(errorData.data.user.code);
      }

      // Update auth data with incomplete registration status
      const currentAuth = storage.getAuth();
      if (currentAuth && errorData.data.user) {
        const updatedAuth = {
          ...currentAuth,
          user: {
            ...errorData.data.user,
            points: currentAuth.user.points || 0, // Preserve existing points or default to 0
          },
          is_registration_complete: false,
        };
        storage.setAuth(updatedAuth);

        // Dispatch auth change event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("authChange"));
        }
      }

      // Return a custom error type for registration incomplete
      const customError = {
        error: {
          status: 403,
          data: errorData,
        } as RegistrationIncompleteErrorResponse,
      };

      return customError;
    }
  }

  return result;
};

// Enhanced base query that includes locale in cache key for GET requests only
const enhancedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | RegistrationIncompleteErrorResponse
> = async (args, api, extraOptions) => {
  // Use localeService to get the most current locale
  const currentLocale = getCurrentLocale();

  // Only attach locale as a query param for GET requests to avoid breaking POST bodies
  let enhancedArgs: string | FetchArgs;
  if (typeof args === "string") {
    // string implies GET - add locale as query parameter
    const separator = args.includes("?") ? "&" : "?";
    enhancedArgs = {
      url: `${args}${separator}locale=${currentLocale}`,
      params: {},
    } as FetchArgs;
  } else {
    const method = (args.method || "GET").toUpperCase();
    if (method === "GET") {
      // For GET requests, ensure locale is in query params
      const separator = args.url.includes("?") ? "&" : "?";
      enhancedArgs = {
        ...args,
        url: `${args.url}${separator}locale=${currentLocale}`,
        params: { ...args.params },
      } as FetchArgs;
    } else {
      // For non-GET, keep args unchanged; locale is already added as a header in prepareHeaders
      enhancedArgs = args;
    }
  }

  return baseQueryWithAuth(enhancedArgs, api, extraOptions);
};

// Create the main API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: enhancedBaseQuery,
  tagTypes: [
    "Auth",
    "Profile",
    "Products",
    "Categories",
    "Brands",
    "Cart",
    "Wishlist",
    "Favourites",
    "Orders",
    "Addresses",
    "Requests",
    "Banners",
    "Offers",
    "Sections",
    "Partners",
    "Settings",
    "Points",
  ],
  endpoints: () => ({}),
});

export default api;
