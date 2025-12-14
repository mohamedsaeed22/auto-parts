import { api } from "./baseApi";
import type {
  ApiResponse,
  CompanySettings,
  LegalPages,
  LegalPageContent,
} from "./types";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get Company Settings
    getCompanySettings: builder.query<ApiResponse<CompanySettings>, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),

    // Get Legal Pages
    getLegalPages: builder.query<ApiResponse<LegalPages>, void>({
      query: () => "/settings/legal",
      providesTags: ["Settings"],
    }),

    // Get Terms of Service
    getTermsOfService: builder.query<ApiResponse<LegalPageContent>, void>({
      query: () => "/settings/legal/terms_of_service",
      providesTags: ["Settings"],
    }),

    // Get Privacy Policy
    getPrivacyPolicy: builder.query<ApiResponse<LegalPageContent>, void>({
      query: () => "/settings/legal/privacy_policy",
      providesTags: ["Settings"],
    }),

    // Get Refund Policy
    getRefundPolicy: builder.query<ApiResponse<LegalPageContent>, void>({
      query: () => "/settings/legal/refund_policy",
      providesTags: ["Settings"],
    }),

    // Get Shipping Policy
    getShippingPolicy: builder.query<ApiResponse<LegalPageContent>, void>({
      query: () => "/settings/legal/shipping_policy",
      providesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useGetLegalPagesQuery,
  useGetTermsOfServiceQuery,
  useGetPrivacyPolicyQuery,
  useGetRefundPolicyQuery,
  useGetShippingPolicyQuery,
} = settingsApi;
