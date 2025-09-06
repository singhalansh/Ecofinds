import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";
import { authApi } from "./api/authApi";
import { userProductsApi } from "./api/userProductsApi";

const rootRedcuer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userProductsApi.reducerPath]: userProductsApi.reducer,
    auth: authReducer,
});
export default rootRedcuer;
