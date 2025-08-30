import { api } from "./baseApi";

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
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
