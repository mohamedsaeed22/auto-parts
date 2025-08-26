import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "@/store";

// Base URL from your Postman collection
const BASE_URL = "https://iseek.name/api";

// Custom base query with auth token handling
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from your auth state (adjust based on your auth slice structure)
      const state = getState() as RootState;
      const token = (state as unknown as { auth?: { token?: string } }).auth
        ?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

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

  // Handle unauthorized responses
  if (result.error && result.error.status === 401) {
    // Dispatch logout action or redirect to login
    // You can customize this based on your auth logic
    console.warn(
      "Unauthorized request, consider refreshing token or redirecting to login"
    );
  }

  return result;
};

// Create the main API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
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
