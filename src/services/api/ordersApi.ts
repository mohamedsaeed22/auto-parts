import { api } from "./baseApi";
import type {
  ApiResponse,
  PaginatedResponse,
  Order,
  OrdersRequest,
  CreateOrderRequest,
  OrderStatistics,
} from "./types";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Orders
    getOrders: builder.query<
      ApiResponse<PaginatedResponse<Order>>,
      OrdersRequest | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.status) queryParams.append("status", params.status);
        if (params?.payment_status)
          queryParams.append("payment_status", params.payment_status);
        if (params?.date_from)
          queryParams.append("date_from", params.date_from);
        if (params?.date_to) queryParams.append("date_to", params.date_to);
        if (params?.per_page)
          queryParams.append("per_page", params.per_page.toString());
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params?.sort_direction)
          queryParams.append("sort_direction", params.sort_direction);

        const queryString = queryParams.toString();
        return `/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Orders"],
    }),

    // Create Order
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("payment_method", data.payment_method);
        formData.append("address_id", data.address_id.toString());

        if (data.coupon_code) formData.append("coupon_code", data.coupon_code);
        if (data.notes) formData.append("notes", data.notes);

        return {
          url: "/orders",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Orders", "Cart"],
    }),

    // Get Single Order
    getOrder: builder.query<ApiResponse<Order>, string>({
      query: (orderNumber) => `/orders/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [
        { type: "Orders", id: orderNumber },
      ],
    }),

    // Get Order Statistics
    getOrderStatistics: builder.query<ApiResponse<OrderStatistics>, void>({
      query: () => "/orders/statistics",
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrderStatisticsQuery,
} = ordersApi;
