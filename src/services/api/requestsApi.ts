import { api } from "./baseApi";
import type {
  ApiResponse,
  PaginatedResponse,
  CustomRequest,
  CreateRequestRequest,
  RequestsRequest,
} from "./types";

export const requestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Requests
    getRequests: builder.query<
      ApiResponse<PaginatedResponse<CustomRequest>>,
      RequestsRequest | void
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append("status", params.status);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.per_page)
          queryParams.append("per_page", params.per_page.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        const queryString = queryParams.toString();
        return `/requests${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Requests"],
    }),

    // Create New Request
    createRequest: builder.mutation<
      ApiResponse<CustomRequest>,
      CreateRequestRequest
    >({
      query: (data) => {
        const formData = new FormData();

        data.items.forEach((item, index) => {
          formData.append(`items[${index}][part_name]`, item.part_name);
          formData.append(
            `items[${index}][quantity]`,
            item.quantity.toString()
          );
          formData.append(
            `items[${index}][chassis_number]`,
            item.chassis_number
          );

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
