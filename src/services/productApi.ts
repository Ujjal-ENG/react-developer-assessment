import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, Product, ProductsResponse } from "../types";

const BASE_URL = import.meta.env.APP_BASE_URL || "https://dummyjson.com";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product", "Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      { limit?: number; skip?: number; category?: string }
    >({
      query: ({ limit = 10, skip = 0, category }) => {
        if (category) {
          return `/products/category/${category}?limit=${limit}&skip=${skip}`;
        }
        return `/products?limit=${limit}&skip=${skip}`;
      },
      providesTags: ["Products"],
    }),

    searchProducts: builder.query<
      ProductsResponse,
      { q: string; limit?: number; skip?: number }
    >({
      query: ({ q, limit = 10, skip = 0 }) =>
        `/products/search?q=${q}&limit=${limit}&skip=${skip}`,
      providesTags: ["Products"],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => "/products/categories",
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        "Products",
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} = productApi;
