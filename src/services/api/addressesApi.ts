import { api } from "./baseApi";
import type {
  ApiResponse,
  Address,
  AddressesResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "./types";

export const addressesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Addresses
    getAddresses: builder.query<ApiResponse<AddressesResponse>, void>({
      query: () => "/addresses",
      providesTags: ["Addresses"],
    }),

    // Get Single Address
    getAddress: builder.query<ApiResponse<Address>, number>({
      query: (id) => `/addresses/${id}`,
      providesTags: (result, error, id) => [{ type: "Addresses", id }],
    }),

    // Create New Address
    createAddress: builder.mutation<ApiResponse<Address>, CreateAddressRequest>(
      {
        query: (data) => {
          const formData = new FormData();
          formData.append("address_type", data.address_type);
          formData.append("name", data.name);
          formData.append("phone", data.phone);
          formData.append("city", data.city);
          formData.append("detailed_address", data.detailed_address);
          formData.append("postal_code", data.postal_code);
          formData.append("is_default", data.is_default ? "1" : "0");

          return {
            url: "/addresses",
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["Addresses"],
      }
    ),

    // Update Address
    updateAddress: builder.mutation<
      ApiResponse<Address>,
      { id: number } & UpdateAddressRequest
    >({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append("address_type", data.address_type);
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        formData.append("city", data.city);
        formData.append("detailed_address", data.detailed_address);
        formData.append("postal_code", data.postal_code);
        formData.append("is_default", data.is_default ? "1" : "0");

        return {
          url: `/addresses/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Addresses"],
    }),

    // Delete Address
    deleteAddress: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
