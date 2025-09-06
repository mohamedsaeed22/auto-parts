import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";
import { Product } from "./products";

export interface FavoriteItem {
  id: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface FavoritesResponse {
  data: FavoriteItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const favoritesKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoritesKeys.all, "list"] as const,
  list: (page: number) => [...favoritesKeys.lists(), { page }] as const,
};

const getFavorites = async ({ page = 1 }: { page?: number }) => {
  const { data } = await axios.get<FavoritesResponse>("/api/favorites", {
    params: { page },
  });
  return data;
};

const addToFavorites = async (product_id: number) => {
  const { data } = await axios.post<FavoritesResponse>("/api/favorites", {
    product_id,
  });
  return data;
};

const removeFromFavorites = async (id: number) => {
  const { data } = await axios.delete<FavoritesResponse>(
    `/api/favorites/${id}`
  );
  return data;
};

const clearFavorites = async () => {
  const { data } = await axios.delete<FavoritesResponse>("/api/favorites");
  return data;
};

export function useFavorites(page = 1) {
  return useQuery({
    queryKey: favoritesKeys.list(page),
    queryFn: () => getFavorites({ page }),
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: (data) => {
      queryClient.setQueryData(favoritesKeys.list(1), data);
      showSuccess("Product added to favorites successfully");
    },
    onError: (error: unknown) => {
      showError(
        error?.response?.data?.message || "Failed to add product to favorites"
      );
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: (data) => {
      queryClient.setQueryData(favoritesKeys.list(1), data);
      showSuccess("Product removed from favorites successfully");
    },
    onError: (error: unknown) => {
      showError(
        error?.response?.data?.message ||
          "Failed to remove product from favorites"
      );
    },
  });
}

export function useClearFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearFavorites,
    onSuccess: (data) => {
      queryClient.setQueryData(favoritesKeys.list(1), data);
      showSuccess("Favorites cleared successfully");
    },
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to clear favorites");
    },
  });
}
