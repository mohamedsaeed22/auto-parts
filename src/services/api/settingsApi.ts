import { api } from "./baseApi";
import type { ApiResponse, AppSettings, LegalContent } from "./types";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get App Settings
    getSettings: builder.query<ApiResponse<AppSettings>, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),

    // Get Legal Pages
    getLegalContent: builder.query<ApiResponse<LegalContent>, void>({
      query: () => "/settings/legal",
      providesTags: ["Settings"],
    }),

    // Get Terms of Service
    getTermsOfService: builder.query<ApiResponse<{ content: string }>, void>({
      query: () => "/settings/legal/terms_of_service",
      providesTags: ["Settings"],
    }),

    // Get Privacy Policy
    getPrivacyPolicy: builder.query<ApiResponse<{ content: string }>, void>({
      query: () => "/settings/legal/privacy_policy",
      providesTags: ["Settings"],
    }),

    // Get Refund Policy
    getRefundPolicy: builder.query<ApiResponse<{ content: string }>, void>({
      query: () => "/settings/legal/refund_policy",
      providesTags: ["Settings"],
    }),

    // Get Shipping Policy
    getShippingPolicy: builder.query<ApiResponse<{ content: string }>, void>({
      query: () => "/settings/legal/shipping_policy",
      providesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetLegalContentQuery,
  useGetTermsOfServiceQuery,
  useGetPrivacyPolicyQuery,
  useGetRefundPolicyQuery,
  useGetShippingPolicyQuery,
} = settingsApi;
