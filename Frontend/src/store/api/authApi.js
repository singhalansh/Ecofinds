import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../features/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const USER_API = `${BASE_URL}/api/v1/`;

export const authApi = createApi({
    reducerPath: "authApi",
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
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData,
            }),
        }),

        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    console.log("User Data after login : ", result.data);
                    // Store both user data and token
                    localStorage.setItem("user", JSON.stringify(result.data));
                    if (result.data.token) {
                        localStorage.setItem("auth_token", result.data.token);
                    }
                    dispatch(userLoggedIn({ user: result.data }));
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    localStorage.removeItem("user");
                    localStorage.removeItem("auth_token");
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        loadUser: builder.query({
            query: () => ({
                url: "me",
                method: "GET",
            }),
            providesTags: ["User"],
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    console.log("User Data after loading : ", result.data);
                    localStorage.setItem("user", JSON.stringify(result.data)); // Save to storage
                    dispatch(userLoggedIn({ user: result.data }));
                } catch (error) {
                    console.log("Error loading user:", error);
                    // If loadUser fails, clear the stored data
                    localStorage.removeItem("user");
                    localStorage.removeItem("auth_token");
                    dispatch(userLoggedOut());
                }
            },
        }),

        forgetPassword: builder.mutation({
            query: (emailData) => ({
                url: "password/forgot",
                method: "POST",
                body: emailData,
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, newPassword }) => ({
                url: `password/reset/${token}`,
                method: "PUT",
                body: newPassword,
            }),
        }),

        updatePassword: builder.mutation({
            query: ({ data }) => ({
                url: `password/update`,
                method: "PUT",
                body: data,
            }),
        }),

        updatePersonalDetail: builder.mutation({
            query: ({ data }) => ({
                url: `me/update`,
                method: "PUT",
                body: data,
            }),
        }),

        updateUserDetails: builder.mutation({
            query: ({ id, updateData }) => ({
                url: `update/${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: ["User"],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        updateUserRole: builder.mutation({
            query: ({ id, roleData }) => ({
                url: `/user/updateRole/${id}`,
                method: "PUT",
                body: roleData,
            }),
            invalidatesTags: ["User"],
        }),

        // wishlist

        addToWishlist: builder.mutation({
            query: (productId) => ({
                url: "user/wishlist",
                method: "POST",
                body: productId,
            }),
            invalidatesTags: ["User"],
        }),

        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: "user/wishlist",
                method: "DELETE",
                body: { productId },
            }),
            invalidatesTags: ["User"],
        }),

        // Cart Section
        addToCart: builder.mutation({
            query: (product) => ({
                url: "user/cart",
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["User"], // or use "Cart"
        }),

        removeFromCart: builder.mutation({
            query: (product) => ({
                url: "user/cart",
                method: "DELETE",
                body: product,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useForgetPasswordMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
    useUpdatePersonalDetailMutation,
    useUpdateUserDetailsMutation,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useAddToCartMutation,
    useRemoveFromCartMutation,
} = authApi;
