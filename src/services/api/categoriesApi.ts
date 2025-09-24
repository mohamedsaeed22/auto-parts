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

export interface CategoriesQueryParams {
  level?: number;
  perPage?: number;
  with_children?: boolean;
}

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoriesResponse,
      CategoriesQueryParams | void
    >({
      query: (params: CategoriesQueryParams = {}) => {
        const searchParams = new URLSearchParams();
        if (params.level) searchParams.append("level", params.level.toString());
        if (params.perPage)
          searchParams.append("perPage", params.perPage.toString());
        if (params.with_children !== undefined)
          searchParams.append("with_children", params.with_children.toString());

        const queryString = searchParams.toString();
        const url = `/categories${queryString ? `?${queryString}` : ""}`;
        return url;
      },
      providesTags: ["Categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
