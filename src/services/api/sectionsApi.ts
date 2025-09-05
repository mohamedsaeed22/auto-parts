import { api } from "./baseApi";
import { Product } from "./types";

export interface SectionProduct extends Product {
  id: number;
  name: string;
  price: string;
  final_price: number;
  primary_image: string;
  hover_text: string;
  product_identifier: string;
  is_active: boolean;
}

export interface Section {
  id: number;
  title: string;
  image: string;
  products_count: number;
  products: SectionProduct[];
}

export interface SectionsResponse {
  code: number;
  message: string;
  errors: string[];
  data: {
    items: Section[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

export interface SectionsRequest {
  page?: number;
  per_page?: number;
}

export const sectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<SectionsResponse, SectionsRequest>({
      query: (params) => ({
        url: "/sections",
        params,
      }),
      providesTags: ["Sections"],
    }),
  }),
});

export const { useGetSectionsQuery } = sectionsApi;
