import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";
import { Product } from "./products";

export interface WishlistItem {
  id: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface WishlistResponse {
  data: WishlistItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const wishlistKeys = {
  all: ["wishlist"] as const,
  lists: () => [...wishlistKeys.all, "list"] as const,
  list: (page: number) => [...wishlistKeys.lists(), { page }] as const,
};

const getWishlist = async ({ page = 1 }: { page?: number }) => {
  const { data } = await axios.get<WishlistResponse>("/api/wishlist", {
    params: { page },
  });
  return data;
};

const addToWishlist = async (product_id: number) => {
  const { data } = await axios.post<WishlistResponse>("/api/wishlist", {
    product_id,
  });
  return data;
};

const removeFromWishlist = async (id: number) => {
  const { data } = await axios.delete<WishlistResponse>(`/api/wishlist/${id}`);
  return data;
};

const clearWishlist = async () => {
  const { data } = await axios.delete<WishlistResponse>("/api/wishlist");
  return data;
};

export function useWishlist(page = 1) {
  return useQuery({
    queryKey: wishlistKeys.list(page),
    queryFn: () => getWishlist({ page }),
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.list(1), data);
      showSuccess("Product added to wishlist successfully");
    },
    onError: (error: unknown) => {
      showError(
        error?.response?.data?.message || "Failed to add product to wishlist"
      );
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.list(1), data);
      showSuccess("Product removed from wishlist successfully");
    },
    onError: (error: unknown) => {
      showError(
        error?.response?.data?.message ||
          "Failed to remove product from wishlist"
      );
    },
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.list(1), data);
      showSuccess("Wishlist cleared successfully");
    },
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to clear wishlist");
    },
  });
}
