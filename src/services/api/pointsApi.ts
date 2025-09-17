import { api } from "./baseApi";
import type { ApiResponse, PointsResponse } from "./types";

export const pointsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get Points Transactions
    getPointsTransactions: builder.query<ApiResponse<PointsResponse>, void>({
      query: () => "/points/transactions",
      providesTags: ["Points"],
    }),
  }),
});

export const { useGetPointsTransactionsQuery } = pointsApi;
