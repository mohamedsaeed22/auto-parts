import { api } from "./baseApi";

export interface FavouriteItem {
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

export interface FavouritesResponse {
  data: FavouriteItem[];
  message: string;
  status: boolean;
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
