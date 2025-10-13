import { api } from "./baseApi";
import type { ApiResponse } from "./types";

export interface City {
  key: string;
  value: string;
}

export interface CitiesResponse {
  cities: City[];
}

export const citiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all cities with locale support
    getCities: builder.query<ApiResponse<CitiesResponse>, string | void>({
      query: (locale) => ({
        url: "/cities",
        params: {
          locale: locale || "en",
        },
      }),
      // Cache cities data but separate by locale
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetCitiesQuery } = citiesApi;
