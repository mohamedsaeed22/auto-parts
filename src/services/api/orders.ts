import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";
import { Product } from "./products";
import { Address } from "./checkout";

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  discount_price: number | null;
  final_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: "cash" | "card";
  payment_status: "pending" | "paid" | "failed";
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface OrderResponse {
  data: Order;
}

const ordersKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  list: (page: number) => [...ordersKeys.lists(), { page }] as const,
  details: () => [...ordersKeys.all, "detail"] as const,
  detail: (id: number) => [...ordersKeys.details(), id] as const,
};

const getOrders = async ({ page = 1 }: { page?: number }) => {
  const { data } = await axios.get<OrdersResponse>("/api/orders", {
    params: { page },
  });
  return data;
};

const getOrder = async (id: number) => {
  const { data } = await axios.get<OrderResponse>(`/api/orders/${id}`);
  return data;
};

const cancelOrder = async (id: number) => {
  const { data } = await axios.post<OrderResponse>(`/api/orders/${id}/cancel`);
  return data;
};

export function useOrders(page = 1) {
  return useQuery({
    queryKey: ordersKeys.list(page),
    queryFn: () => getOrders({ page }),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => getOrder(id),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      queryClient.setQueryData(ordersKeys.detail(data.data.id), {
        data: data.data,
      });
      queryClient.invalidateQueries({
        queryKey: ordersKeys.lists(),
      });
      showSuccess("Order cancelled successfully");
    },
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to cancel order");
    },
  });
}
