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
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetBannersQuery,
  useGetOffersQuery,
  useGetOfferQuery,
  useGetSectionsQuery,
  useGetSectionQuery,
  useGetPartnersQuery,
} from "./api/productsApi";

// Cart & Wishlist Hooks
export {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useGetFavouritesQuery,
  useToggleFavouriteMutation,
} from "./api/cartApi";

// Orders Hooks
export {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrderStatisticsQuery,
} from "./api/ordersApi";

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
  useGetSettingsQuery,
  useGetLegalContentQuery,
  useGetTermsOfServiceQuery,
  useGetPrivacyPolicyQuery,
  useGetRefundPolicyQuery,
  useGetShippingPolicyQuery,
} from "./api/settingsApi";

// Re-export types for convenience
export type * from "./api/types";
