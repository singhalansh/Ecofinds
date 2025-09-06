import { configureStore } from "@reduxjs/toolkit";
import rootRedcuer from "./rootRedcuer";
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";
import { userProductsApi } from "./api/userProductsApi";

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(
            authApi.middleware,
            productApi.middleware,
            orderApi.middleware,
            userProductsApi.middleware
        ),
});

const initializeApp = async () => {
    // Only try to load user if there's a token
    const token = localStorage.getItem("auth_token");
    if (token) {
        try {
            await appStore.dispatch(
                authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
            );
        } catch (error) {
            console.log("Failed to load user on app initialization:", error);
        }
    }
};
initializeApp();
