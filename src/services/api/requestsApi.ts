import { api } from "./baseApi";
import type { ApiResponse } from "./types";

// Request item interface based on Postman API
export interface RequestItem {
  part_name: string;
  quantity: string;
  chassis_number?: string;
  part_image_path?: File;
  order_image_path?: File;
  form_image_path?: File;
}

// Request creation interface
export interface CreateRequestRequest {
  items: RequestItem[];
}

// Request item response interface (from API)
export interface RequestItemResponse {
  id: number;
  request_id: number;
  part_name: string;
  quantity: number;
  price_without_tax: number;
  tax: number;
  price: string | null;
  chassis_number: string | null;
  part_image_url: string | null;
  order_image_url: string | null;
  form_image_url: string | null;
  created_at: string;
  updated_at: string;
}

// User interface for request response
export interface RequestUser {
  id: number;
  name: string;
  email: string;
  code: string;
}

// Request response interface (from API)
export interface RequestResponse {
  id: number;
  user_id: number;
  user_type: "shop" | "workshop";
  user_type_label: string;
  status:
    | "draft"
    | "pending"
    | "submitted"
    | "accepted"
    | "rejected"
    | "completed";
  payment_method: string;
  submitted_at: string | null;
  workshop_code: string | null;
  price: string | null;
  address_id: number | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  phone: string | null;
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  formatted_address: string;
  notes: string | null;
  tracking_number: string | null;
  pdf_label: string | null;
  payment_status: "pending" | "paid" | "failed";
  shipped_at: string | null;
  created_at: string;
  updated_at: string;
  address_details: unknown | null;
  items: RequestItemResponse[];
  calculated_total: number;
  can_be_submitted: boolean;
  has_address_details: boolean;
  // New fields from backend response
  user?: RequestUser;
  calculated_total_without_tax?: number;
  calculated_total_tax?: number;
  delivery_amount?: number;
  delivery_amount_without_tax?: number;
  delivery_amount_tax?: number;
  final_total?: number;
  total_weight?: number;
  calculated_total_weight?: number;
}

// Requests list request interface
export interface RequestsRequest {
  status?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

// Pagination interface
export interface PaginationResponse {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Requests list response interface
export interface RequestsResponse {
  requests: RequestResponse[];
  pagination: PaginationResponse;
}

// Approve/Reject request interface
export interface ApproveRequestRequest {
  status: "accepted" | "rejected";
  payment_method?: "cash" | "credit_card";
  address_id?: number;
  address?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  apartment?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  notes?: string;
}

// Approve/Reject request response interface
export interface ApproveRequestResponse {
  id: number;
  status: string;
  message: string;
  payment_url?: string;
}

// Delivery amount response interface
export interface DeliveryAmountResponse {
  delivery_amount: number;
}

export const requestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all requests
    getRequests: builder.query<ApiResponse<RequestsResponse>, RequestsRequest>({
      query: (params: RequestsRequest) => {
        const searchParams = new URLSearchParams();

        if (params.status && params.status !== "all")
          searchParams.append("status", params.status);
        if (params.date_from && params.date_from.trim() !== "")
          searchParams.append("date_from", params.date_from);
        if (params.date_to && params.date_to.trim() !== "")
          searchParams.append("date_to", params.date_to);
        if (params.per_page)
          searchParams.append("per_page", params.per_page.toString());
        if (params.page) searchParams.append("page", params.page.toString());

        const queryString = searchParams.toString();
        return `/requests${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Requests"],
    }),

    // Create new request
    createRequest: builder.mutation<
      ApiResponse<RequestResponse>,
      CreateRequestRequest
    >({
      query: (data) => {
        const formData = new FormData();

        // Add items array to form data
        data.items.forEach((item, index) => {
          formData.append(`items[${index}][part_name]`, item.part_name);
          formData.append(`items[${index}][quantity]`, item.quantity);

          if (item.chassis_number) {
            formData.append(
              `items[${index}][chassis_number]`,
              item.chassis_number
            );
          }

          if (item.part_image_path) {
            formData.append(
              `items[${index}][part_image_path]`,
              item.part_image_path
            );
          }

          if (item.order_image_path) {
            formData.append(
              `items[${index}][order_image_path]`,
              item.order_image_path
            );
          }

          if (item.form_image_path) {
            formData.append(
              `items[${index}][form_image_path]`,
              item.form_image_path
            );
          }
        });

        return {
          url: "/requests",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Requests"],
    }),

    // Get single request details
    getRequestDetails: builder.query<
      ApiResponse<RequestResponse>,
      string | number
    >({
      query: (requestId) => `/requests/${requestId}`,
      providesTags: (result, error, id) => [{ type: "Requests", id }],
    }),

    // Approve/Reject request
    approveRequest: builder.mutation<
      ApiResponse<ApproveRequestResponse>,
      { requestId: number; data: ApproveRequestRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/requests/${requestId}/approve`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Requests"],
    }),

    // Get delivery amount
    getDeliveryAmount: builder.query<
      ApiResponse<DeliveryAmountResponse>,
      { requestId: number; addressId: number }
    >({
      query: ({ requestId, addressId }) =>
        `/requests/get-delivery-amount/${requestId}/${addressId}`,
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetRequestDetailsQuery,
  useCreateRequestMutation,
  useApproveRequestMutation,
  useGetDeliveryAmountQuery,
} = requestsApi;
