import { api } from "./baseApi";
import type {
  ApiResponse,
  Cart,
  AddToCartRequest,
  UpdateCartRequest,
  ApplyCouponRequest,
  ToggleWishlistRequest,
  ToggleFavouriteRequest,
  Product,
} from "./types";

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Cart Operations
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<ApiResponse<Cart>, AddToCartRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("product_id", data.product_id.toString());
        formData.append("quantity", data.quantity.toString());

        return {
          url: "/cart/add",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      ApiResponse<Cart>,
      { id: number } & UpdateCartRequest
    >({
      query: ({ id, ...data }) => {
        const formData = new URLSearchParams();
        formData.append("quantity", data.quantity.toString());

        return {
          url: `/cart/update/${id}`,
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    applyCoupon: builder.mutation<ApiResponse<Cart>, ApplyCouponRequest>({
      query: (data) => {
        const formData = new URLSearchParams();
        formData.append("coupon_code", data.coupon_code);

        return {
          url: "/cart/apply-coupon",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
      invalidatesTags: ["Cart"],
    }),

    // Wishlist Operations
    getWishlist: builder.query<ApiResponse<Product[]>, void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    toggleWishlist: builder.mutation<ApiResponse, ToggleWishlistRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("product_id", data.product_id.toString());

        return {
          url: "/wishlist/toggle",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Wishlist", "Products"],
    }),

    // Favourites Operations
    getFavourites: builder.query<ApiResponse<Product[]>, void>({
      query: () => "/favourites",
      providesTags: ["Favourites"],
    }),

    toggleFavourite: builder.mutation<ApiResponse, ToggleFavouriteRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("product_id", data.product_id.toString());

        return {
          url: "/favourites/toggle",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Favourites", "Products"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useGetFavouritesQuery,
  useToggleFavouriteMutation,
} = cartApi;
