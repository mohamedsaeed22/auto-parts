import { api } from "./baseApi";
import type { ApiResponse } from "./types";

// Order item interface
export interface OrderProduct {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_image: string;
  price: number;
  discount_percentage: number;
  discount_amount: number;
  final_unit_price: number;
  quantity: number;
  total: number;
  line_total: number;
  options: unknown[];
  product: {
    id: number;
    name: string;
    price: string;
    discount_type: string | null;
    discount_amount: string | null;
    final_price: number;
    discount_info: string;
    offer: {
      id: number;
      image: string;
      discount_type: string;
      discount_amount: string;
      discount_info: string;
      products_count: number;
    } | null;
    primary_image: string;
    images: string[];
    description: string;
    hover_text: string;
    product_identifier: string;
    in_favorites: boolean;
    in_wishlist: boolean;
  } | null; // Product can be null in the orders list response
  created_at: string;
  updated_at: string;
}

// Order interface
export interface Order {
  id: number;
  order_number: string;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled"
    | "refunded";
  payment_method:
    | "cash"
    | "credit_card"
    | "paypal"
    | "stripe"
    | "bank_transfer";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  address: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    apartment: string | null;
    city: string;
    state: string | null;
    country: string | null;
    zip_code: string;
  };
  pricing: {
    subtotal: number;
    subtotal_without_tax?: number;
    subtotal_tax?: number;
    discount_amount: number;
    tax_amount: number;
    shipping_cost: number;
    shipping_cost_without_tax?: number;
    shipping_cost_tax?: number;
    total: number;
    grand_total?: number; // Optional - not always present in list response
    currency: string;
  };
  coupon: {
    code: string | null;
    discount: number;
    details: {
      id: number;
      code: string;
      name: string;
      description: string;
      type: "percentage" | "fixed";
      value: number;
      is_valid: boolean;
      has_reached_limit: boolean;
    } | null;
  };
  products: OrderProduct[];
  notes: string | null;
  tracking_number: string | null;
  pdf_label: string | null; // PDF label URL for the order
  total_items: number;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  can_be_cancelled: boolean;
  can_be_refunded: boolean;
}

// Orders response interface
export interface OrdersResponse {
  items: Order[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// Order details response interface
export interface OrderDetailsResponse {
  order: DetailedOrder;
}

// Detailed order interface for the API response
export interface DetailedOrderProduct {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_image: string;
  size: string | null;
  price: number;
  discount_percentage: number;
  discount_amount: number;
  final_unit_price: number;
  quantity: number;
  total: number;
  line_total: number;
  options: unknown[];
  product: {
    id: number;
    name: string;
    price: string;
    discount_type: string | null;
    discount_amount: string | null;
    final_price: number;
    discount_info: string;
    offer: {
      id: number;
      image: string;
      discount_type: string;
      discount_amount: string;
      discount_info: string;
      products_count: number;
    } | null;
    primary_image: string;
    images: string[];
    description: string;
    hover_text: string;
    product_identifier: string;
    in_favorites: boolean;
    in_wishlist: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface DetailedOrder {
  id: number;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  address: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    apartment: string | null;
    city: string;
    state: string | null;
    country: string | null;
    zip_code: string;
  };
  pricing: {
    subtotal: number;
    subtotal_without_tax?: number;
    subtotal_tax?: number;
    discount_amount: number;
    tax_amount: number;
    shipping_cost: number;
    shipping_cost_without_tax?: number;
    shipping_cost_tax?: number;
    total: number;
    grand_total: number;
    currency: string;
  };
  coupon: {
    code: string;
    discount: number;
    details: {
      id: number;
      code: string;
      name: string;
      description: string;
      type: string;
      value: number;
      is_valid: boolean;
      has_reached_limit: boolean;
    };
  } | null;
  products: DetailedOrderProduct[];
  notes: string | null;
  tracking_number: string | null;
  total_items: number;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  can_be_cancelled: boolean;
  can_be_refunded: boolean;
}

// Orders request interface
export interface OrdersRequest {
  status?:
    | "all"
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled"
    | "refunded";
  payment_status?: "all" | "pending" | "paid" | "failed" | "refunded";
  date_from?: string;
  date_to?: string;
  per_page?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
}

// Orders statistics interface
export interface OrdersStatistics {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

// Orders statistics response interface
export interface OrdersStatisticsResponse {
  statistics: OrdersStatistics;
}

// Create orders API using injectEndpoints
export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      ApiResponse<{ order: Order; payment_url?: string }>,
      | FormData
      | {
          payment_method: string;
          address_id: number;
          coupon_code?: string;
          notes?: string;
        }
    >({
      query: (data) => {
        let body: FormData;

        if (data instanceof FormData) {
          body = data;
        } else {
          const formData = new FormData();
          formData.append("payment_method", data.payment_method);
          formData.append("address_id", String(data.address_id));
          formData.append("coupon_code", data.coupon_code || "");
          formData.append("notes", data.notes || "");
          body = formData;
        }

        return {
          url: "/orders",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Cart", "Orders"],
    }),
    getOrders: builder.query<ApiResponse<OrdersResponse>, OrdersRequest>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add filters only if they have values
        if (params.status && params.status !== "all") {
          searchParams.append("status", params.status);
        }
        if (params.payment_status && params.payment_status !== "all") {
          searchParams.append("payment_status", params.payment_status);
        }
        if (params.date_from && params.date_from.trim() !== "") {
          searchParams.append("date_from", params.date_from);
        }
        if (params.date_to && params.date_to.trim() !== "") {
          searchParams.append("date_to", params.date_to);
        }
        if (params.per_page) {
          searchParams.append("per_page", params.per_page.toString());
        }
        if (params.sort_by) {
          searchParams.append("sort_by", params.sort_by);
        }
        if (params.sort_direction) {
          searchParams.append("sort_direction", params.sort_direction);
        }
        if (params.page) {
          searchParams.append("page", params.page.toString());
        }

        const queryString = searchParams.toString();
        return `/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Orders"],
    }),
    getOrderDetails: builder.query<ApiResponse<OrderDetailsResponse>, string>({
      query: (orderNumber) => `/orders/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [
        { type: "Orders", id: orderNumber },
      ],
    }),
    getOrdersStatistics: builder.query<
      ApiResponse<OrdersStatisticsResponse>,
      void
    >({
      query: () => "/orders/statistics",
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useGetOrdersStatisticsQuery,
} = ordersApi;
