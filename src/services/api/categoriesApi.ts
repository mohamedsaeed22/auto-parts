import { api } from "../api";

export interface Category {
  id: number;
  name: string;
  level: number;
  image: string;
  parent?: {
    id: number;
    name: string;
  };
  children?: Category[];
}

export interface CategoriesResponse {
  code: number;
  message: string;
  errors: string[];
  data: {
    categories: Category[];
  };
}

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoriesResponse,
      { level?: number; perPage?: number; with_children?: boolean }
    >({
      query: (params) => ({
        url: "/categories",
        params,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
