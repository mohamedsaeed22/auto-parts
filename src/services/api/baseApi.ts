import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "@/store";
import { storage } from "@/lib/storage";
import type { RegistrationIncompleteError } from "./types";

// Base URL from your Postman collection
const BASE_URL = "https://brave.iseek.name/api";

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
    prepareHeaders: (headers, { getState }) => {
      // Get token from storage utility
      const token = storage.getToken();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      // Get current locale from Redux state
      const state = getState() as RootState;
      const currentLocale = state.locale?.currentLocale || "en";
      headers.set("locale", currentLocale);

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
    console.warn("BaseApi - 401 Unauthorized detected, clearing auth data");

    // Clear auth data on 401
    storage.removeAuth();

    // Dispatch auth change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("authChange"));
    }

    // Store current page for redirect after login
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      storage.setPreviousPage(currentPath);
    }
  }

  // Handle registration incomplete responses (403)
  if (result.error && result.error.status === 403) {
    console.log("BaseApi - 403 error detected:", result.error);
    const errorData = result.error.data as RegistrationIncompleteError;
    console.log("BaseApi - Error data:", errorData);

    if (errorData?.data?.is_registration_complete === false) {
      console.log(
        "BaseApi - Registration incomplete detected, storing code:",
        errorData.data.user?.code
      );

      // Store the user code for registration completion
      if (errorData.data.user?.code) {
        storage.setRegistrationCode(errorData.data.user.code);
      }

      // Update auth data with incomplete registration status
      const currentAuth = storage.getAuth();
      if (currentAuth && errorData.data.user) {
        const updatedAuth = {
          ...currentAuth,
          user: errorData.data.user,
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
      console.log("BaseApi - Returning custom error:", customError);
      return customError;
    }
  }

  return result;
};

// Enhanced base query that includes locale in cache key
const enhancedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | RegistrationIncompleteErrorResponse
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const currentLocale = state.locale?.currentLocale || "en";

  // Add locale to the query key for cache invalidation
  const enhancedArgs =
    typeof args === "string"
      ? { url: args, params: { locale: currentLocale } }
      : { ...args, params: { ...args.params, locale: currentLocale } };

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
  ],
  endpoints: () => ({}),
});

export default api;
