import { api } from "./baseApi";

export interface WishlistItem {
  id: number;
  product_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category_id: number;
    brand_id: number;
  };
}

export interface WishlistResponse {
  data: WishlistItem[];
  message: string;
  status: boolean;
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
      invalidatesTags: ["Wishlist"],
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
      invalidatesTags: ["Wishlist"],
    }),

    toggleWishlist: builder.mutation<WishlistResponse, AddWishlistRequest>({
      query: (body) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useToggleWishlistMutation,
} = wishlistApi;
