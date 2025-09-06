import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { USER_API } from "./authApi";

export const userProductsApi = createApi({
    reducerPath: "userProductsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("auth_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["UserProducts"],
    endpoints: (builder) => ({
        // Get user's products
        getUserProducts: builder.query({
            query: () => "user/products",
            providesTags: ["UserProducts"],
        }),

        // Add new product
        addProduct: builder.mutation({
            query: (productData) => ({
                url: "user/products",
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["UserProducts"],
        }),

        // Update product
        updateProduct: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `user/products/${id}`,
                method: "PUT",
                body: updates,
            }),
            invalidatesTags: ["UserProducts"],
        }),

        // Delete product
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `user/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["UserProducts"],
        }),
    }),
});

export const {
    useGetUserProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = userProductsApi;
