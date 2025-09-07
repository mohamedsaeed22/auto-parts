import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";
import { Product } from "./products";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  data: CartItem[];
  meta: {
    total_items: number;
    total_price: number;
    total_discount: number;
    final_price: number;
  };
}

const cartKeys = {
  all: ["cart"] as const,
  lists: () => [...cartKeys.all, "list"] as const,
  list: () => [...cartKeys.lists()] as const,
};

const getCart = async () => {
  const { data } = await axios.get<CartResponse>("/api/cart");
  return data;
};

const addToCart = async ({
  product_id,
  quantity,
}: {
  product_id: number;
  quantity: number;
}) => {
  const { data } = await axios.post<CartResponse>("/api/cart", {
    product_id,
    quantity,
  });
  return data;
};

const updateCartItem = async ({
  id,
  quantity,
}: {
  id: number;
  quantity: number;
}) => {
  const { data } = await axios.put<CartResponse>(`/api/cart/${id}`, {
    quantity,
  });
  return data;
};

const removeFromCart = async (id: number) => {
  const { data } = await axios.delete<CartResponse>(`/api/cart/${id}`);
  return data;
};

const clearCart = async () => {
  const { data } = await axios.delete<CartResponse>("/api/cart");
  return data;
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: getCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.list(), data);
      showSuccess("Product added to cart successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to add product to cart"
      );
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.list(), data);
      showSuccess("Cart updated successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update cart"
      );
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.list(), data);
      showSuccess("Product removed from cart successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to remove product from cart"
      );
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.list(), data);
      showSuccess("Cart cleared successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to clear cart"
      );
    },
  });
}
