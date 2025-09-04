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
  chassis_number: string | null;
  part_image_url: string | null;
  order_image_url: string | null;
  form_image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Request response interface (from API)
export interface RequestResponse {
  id: number;
  user_id: number;
  user_type: "shop" | "workshop";
  user_type_label: string;
  status: "draft" | "pending" | "submitted" | "accepted" | "rejected";
  submitted_at: string | null;
  workshop_code: string | null;
  price: number | null;
  created_at: string;
  updated_at: string;
  items: RequestItemResponse[];
  can_be_submitted: boolean;
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
  }),
});

export const { useGetRequestsQuery, useCreateRequestMutation } = requestsApi;
