/**
 * Centralized export of all RTK Query hooks for easy importing in components
 *
 * Usage examples:
 *
 * // Auth
 * import { useSendOtpMutation, useGetProfileQuery } from '@/services/hooks';
 *
 * // Products
 * import { useGetProductsQuery, useGetCategoriesQuery } from '@/services/hooks';
 *
 * // Cart
 * import { useGetCartQuery, useAddToCartMutation } from '@/services/hooks';
 */

// Auth Hooks
export {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGoogleLoginMutation,
  useCompleteRegistrationMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useVerifyResetPasswordOtpMutation,
  useChangeLanguageMutation,
  useLogoutMutation,
} from "./api/authApi";

// Products & Catalog Hooks
export {
  useGetProductsMutation,
  useGetProductsListQuery,
  useGetProductQuery,
  useGetBrandsQuery,
  useGetBannersQuery,
  useGetOffersQuery,
  useGetOfferQuery,
} from "./api/productsApi";

// Categories Hooks
export { useGetCategoriesQuery } from "./api/categoriesApi";

// Sections Hooks
export { useGetSectionsQuery } from "./api/sectionsApi";

// Cart Hooks
export {
  useGetCartQuery,
  useAddToCartMutation,
  useAddManyToCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
} from "./api/cartApi";

// Wishlist Hooks
export {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useToggleWishlistMutation,
} from "./api/wishlistApi";

// Favourites Hooks
export {
  useGetFavouritesQuery,
  useAddFavouriteMutation,
  useRemoveFavouriteMutation,
  useToggleFavouriteMutation,
} from "./api/favouritesApi";

// Orders Hooks
export { useGetOrdersQuery } from "./api/ordersApi";

// Addresses Hooks
export {
  useGetAddressesQuery,
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "./api/addressesApi";

// Requests Hooks
export {
  useGetRequestsQuery,
  useCreateRequestMutation,
} from "./api/requestsApi";

// Settings Hooks
export {
  useGetCompanySettingsQuery,
  useGetLegalPagesQuery,
  useGetTermsOfServiceQuery,
  useGetPrivacyPolicyQuery,
  useGetRefundPolicyQuery,
  useGetShippingPolicyQuery,
} from "./api/settingsApi";

// Re-export types for convenience
export type * from "./api/types";

// Partners API
export { useGetPartnersQuery } from "./api/partnersApi";
