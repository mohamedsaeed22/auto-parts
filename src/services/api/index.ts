// Export the main API instance
export { api as default } from "./baseApi";

// Export all types
export * from "./types";

// Export all API slices and their hooks
export * from "./authApi";
export * from "./productsApi";
export * from "./cartApi";
export * from "./ordersApi";
export * from "./addressesApi";
export * from "./requestsApi";
export * from "./ordersApi";
export * from "./settingsApi";
export * from "./favouritesApi";
export * from "./wishlistApi";
export * from "./sectionsApi";
export * from "./citiesApi";

// Re-export the main api for store configuration
export { api } from "./baseApi";
