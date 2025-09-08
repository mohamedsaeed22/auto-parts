import { api } from "./baseApi";
import type {
  ApiResponse,
  Cart,
  AddToCartRequest,
  AddManyToCartRequest,
  UpdateCartRequest,
  ApplyCouponRequest,
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

    addManyToCart: builder.mutation<ApiResponse<Cart>, AddManyToCartRequest>({
      query: (data) => {
        const formData = new FormData();
        data.product_ids.forEach((id, index) => {
          formData.append(`product_ids[${index}]`, id.toString());
        });
        data.quantities.forEach((quantity, index) => {
          formData.append(`quantities[${index}]`, quantity.toString());
        });

        return {
          url: "/cart/add-many",
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
      query: ({ id, ...data }) => ({
        url: `/cart/update/${id}`,
        method: "PUT",
        body: {
          quantity: data.quantity,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
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

    // Wishlist and Favourites operations moved to dedicated API files
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useAddManyToCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
} = cartApi;
