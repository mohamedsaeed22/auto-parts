import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { showError } from "@/lib/toast";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  images: string[];
  category_id: number;
  brand_id: number;
  is_favorite: boolean;
  is_in_wishlist: boolean;
  rating: number;
  reviews_count: number;
  stock: number;
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface ProductFilters {
  category_id?: number;
  brand_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "price_asc" | "price_desc" | "newest" | "rating";
  per_page?: number;
}

const productsKeys = {
  all: ["products"] as const,
  lists: () => [...productsKeys.all, "list"] as const,
  list: (filters: ProductFilters) =>
    [...productsKeys.lists(), filters] as const,
  details: () => [...productsKeys.all, "detail"] as const,
  detail: (id: number) => [...productsKeys.details(), id] as const,
};

const getProducts = async ({
  pageParam = 1,
  ...filters
}: ProductFilters & { pageParam?: number }) => {
  const { data } = await axios.get<ProductsResponse>("/api/products", {
    params: {
      ...filters,
      page: pageParam,
    },
  });
  return data;
};

const getProduct = async (id: number) => {
  const { data } = await axios.get<{ data: Product }>(`/api/products/${id}`);
  return data.data;
};

const toggleFavorite = async (id: number) => {
  const { data } = await axios.post<{ data: { is_favorite: boolean } }>(
    `/api/products/${id}/favorite`
  );
  return data.data;
};

const toggleWishlist = async (id: number) => {
  const { data } = await axios.post<{ data: { is_in_wishlist: boolean } }>(
    `/api/products/${id}/wishlist`
  );
  return data.data;
};

export function useProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: productsKeys.list(filters),
    queryFn: ({ pageParam }) => getProducts({ ...filters, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProduct(id),
  });
}

export function useToggleFavorite() {
  return useMutation({
    mutationFn: toggleFavorite,
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to toggle favorite");
    },
  });
}

export function useToggleWishlist() {
  return useMutation({
    mutationFn: toggleWishlist,
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to toggle wishlist");
    },
  });
}
