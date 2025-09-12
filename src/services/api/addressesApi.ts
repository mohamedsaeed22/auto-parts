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
          const urlEncodedData = new URLSearchParams();
          urlEncodedData.append("address_type", data.address_type);
          urlEncodedData.append("name", data.name);
          urlEncodedData.append("phone", data.phone);
          urlEncodedData.append("city", data.city);
          urlEncodedData.append("detailed_address", data.detailed_address);
          urlEncodedData.append("postal_code", data.postal_code);
          urlEncodedData.append("is_default", data.is_default ? "1" : "0");

          return {
            url: "/addresses",
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncodedData.toString(),
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
        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("address_type", data.address_type);
        urlEncodedData.append("name", data.name);
        urlEncodedData.append("phone", data.phone);
        urlEncodedData.append("city", data.city);
        urlEncodedData.append("detailed_address", data.detailed_address);
        urlEncodedData.append("postal_code", data.postal_code);
        urlEncodedData.append("is_default", data.is_default ? "1" : "0");

        return {
          url: `/addresses/${id}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlEncodedData.toString(),
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
