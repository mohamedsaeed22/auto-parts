import { api } from "./baseApi";
import type { ApiResponse, PointsResponse } from "./types";

export const pointsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get Points Transactions
    getPointsTransactions: builder.query<ApiResponse<PointsResponse>, void>({
      query: () => {
        // Get locale from cookie to add as query param
        const locale =
          typeof window !== "undefined"
            ? document.cookie
                .split(";")
                .map((c) => c.trim())
                .find((c) => c.startsWith("NEXT_LOCALE="))
                ?.split("=")[1] || "ar"
            : "ar";
        return `/points/transactions?locale=${locale}`;
      },
      providesTags: ["Points"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPointsTransactionsQuery } = pointsApi;
