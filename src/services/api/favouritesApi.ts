import { api } from "./baseApi";
import { Product } from "./types";

export interface FavouriteItem extends Product {
  // The item is now directly a Product with additional fields
  in_favorites: boolean;
  in_wishlist: boolean;
}

export interface FavouritesResponse {
  code: number;
  message: string;
  errors: string[];
  data: {
    items: FavouriteItem[];
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

export interface AddFavouriteRequest {
  product_id: number;
}

export interface RemoveFavouriteRequest {
  product_id: number;
}

export const favouritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavourites: builder.query<FavouritesResponse, void>({
      query: () => "/favourites",
      providesTags: ["Favourites"],
    }),

    addFavourite: builder.mutation<FavouritesResponse, AddFavouriteRequest>({
      query: (body) => ({
        url: "/favourites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favourites"],
    }),

    removeFavourite: builder.mutation<
      FavouritesResponse,
      RemoveFavouriteRequest
    >({
      query: (body) => ({
        url: "/favourites",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Favourites"],
    }),

    toggleFavourite: builder.mutation<FavouritesResponse, AddFavouriteRequest>({
      query: (body) => ({
        url: "/favourites/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favourites"],
    }),
  }),
});

export const {
  useGetFavouritesQuery,
  useAddFavouriteMutation,
  useRemoveFavouriteMutation,
  useToggleFavouriteMutation,
} = favouritesApi;