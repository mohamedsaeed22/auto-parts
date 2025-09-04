import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storage } from "@/lib/storage";

export interface RequestItem {
  id: number;
  request_id: number;
  part_name: string;
  quantity: number;
  chassis_number: string;
  part_image_url: string | null;
  order_image_url: string | null;
  form_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Request {
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
  items: RequestItem[];
  can_be_submitted: boolean;
}

export interface RequestsResponse {
  code: number;
  message: string;
  errors: string[];
  data: {
    requests: Request[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export interface RequestsRequest {
  status?: "all" | "draft" | "pending" | "submitted" | "accepted" | "rejected";
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

// Create a simple base query without locale injection
const baseQueryWithoutLocale = fetchBaseQuery({
  baseUrl: "https://brave.iseek.name/api",
  prepareHeaders: (headers) => {
    // Get token from storage utility
    const token = storage.getToken();

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // Set default content type
    if (!headers.get("content-type")) {
      headers.set("content-type", "application/json");
    }

    return headers;
  },
});

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery: baseQueryWithoutLocale,
  tagTypes: ["Requests"],
  endpoints: (builder) => ({
    getRequests: builder.query<RequestsResponse, RequestsRequest>({
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
  }),
});

export const { useGetRequestsQuery } = requestsApi;
