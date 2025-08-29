import { api } from "../api";

export interface PartnersResponse {
  code: number;
  message: string;
  errors: string[];
  data: {
    partners: string[];
  };
}

export const partnersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<PartnersResponse, void>({
      query: () => ({
        url: "/partners",
        method: "GET",
      }),
      providesTags: ["Partners"],
    }),
  }),
});

export const { useGetPartnersQuery } = partnersApi;
