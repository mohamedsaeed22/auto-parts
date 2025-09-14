import { api } from "./baseApi";
import { Product } from "./types";

export interface WishlistItem extends Product {
  // The item is now directly a Product with additional fields
  in_favorites: boolean;
  in_wishlist: boolean;
}

export interface WishlistResponse {
  code: number;
  message: string;
  errors: string[];
  data: {
    items: WishlistItem[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
  count: number;
}

export interface AddWishlistRequest {
  product_id: number;
}

export interface RemoveWishlistRequest {
  product_id: number;
}

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<WishlistResponse, AddWishlistRequest>({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "Wishlist",
        "Sections",
        "Products",
        { type: "Products", id: arg.product_id },
      ],
    }),

    removeFromWishlist: builder.mutation<
      WishlistResponse,
      RemoveWishlistRequest
    >({
      query: (body) => ({
        url: "/wishlist",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "Wishlist",
        "Sections",
        "Products",
        { type: "Products", id: arg.product_id },
      ],
    }),

    toggleWishlist: builder.mutation<WishlistResponse, AddWishlistRequest>({
      query: (body) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "Wishlist",
        "Sections",
        "Products",
        { type: "Products", id: arg.product_id },
      ],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useToggleWishlistMutation,
} = wishlistApi;
