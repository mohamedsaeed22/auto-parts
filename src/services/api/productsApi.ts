import { api } from "./baseApi";
import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductDetailsResponse,
  ProductsRequest,
  Category,
  CategoriesRequest,
  Brand,
  BrandsRequest,
  Banner,
  Offer,
  Section,
  Partner,
} from "./types";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Products
    getProducts: builder.mutation<
      ApiResponse<PaginatedResponse<Product>>,
      ProductsRequest | void
    >({
      query: (params) => {
        const formData = new FormData();

        if (params?.category_id)
          formData.append("category_id", params.category_id.toString());
        if (params?.brand_id)
          formData.append("brand_id", params.brand_id.toString());
        if (params?.name) formData.append("name", params.name);
        if (params?.min_price)
          formData.append("min_price", params.min_price.toString());
        if (params?.max_price)
          formData.append("max_price", params.max_price.toString());
        if (params?.product_identifier)
          formData.append("product_identifier", params.product_identifier);
        if (params?.description)
          formData.append("description", params.description);
        if (params?.search) formData.append("search", params.search);

        return {
          url: "/products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Products"],
    }),

    // Get Single Product
    getProduct: builder.query<ApiResponse<ProductDetailsResponse>, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Categories
    getCategories: builder.query<
      ApiResponse<PaginatedResponse<Category>>,
      CategoriesRequest | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.level) queryParams.append("level", params.level.toString());
        if (params?.perPage)
          queryParams.append("perPage", params.perPage.toString());
        if (params?.with_children)
          queryParams.append("with_children", params.with_children.toString());

        const queryString = queryParams.toString();
        return `/categories${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Categories"],
    }),

    // Brands
    getBrands: builder.query<
      ApiResponse<PaginatedResponse<Brand>>,
      BrandsRequest | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.per_page)
          queryParams.append("per_page", params.per_page.toString());
        if (params?.page) queryParams.append("page", params.page.toString());

        const queryString = queryParams.toString();
        return `/brands${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Brands"],
    }),

    // Banners
    getBanners: builder.query<ApiResponse<PaginatedResponse<Banner>>, void>({
      query: () => "/banners",
      providesTags: ["Banners"],
    }),

    // Offers
    getOffers: builder.query<ApiResponse<PaginatedResponse<Offer>>, void>({
      query: () => "/offers",
      providesTags: ["Offers"],
    }),

    // Get Single Offer
    getOffer: builder.query<ApiResponse<Offer>, number>({
      query: (id) => `/offers/${id}`,
      providesTags: (result, error, id) => [{ type: "Offers", id }],
    }),

    // Sections moved to dedicated sectionsApi.ts file

    // Partners
    getPartners: builder.query<ApiResponse<Partner[]>, void>({
      query: () => "/partners",
      providesTags: ["Partners"],
    }),
  }),
});

export const {
  useGetProductsMutation,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetBannersQuery,
  useGetOffersQuery,
  useGetOfferQuery,
  useGetPartnersQuery,
} = productsApi;
