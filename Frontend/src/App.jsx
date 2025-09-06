import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { appStore } from "./store/store";
import { Toaster } from "@/components/ui/toast";
// Removed AuthProvider - using Redux for authentication
import { EcommerceProvider } from "./contexts/EcommerceContext";
import { UserProductsProvider } from "./contexts/UserProductsContext";
import "./App.css";

// Pages
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Vendor from "./pages/Vendor/Vendor";
import Cart from "./pages/Cart/Cart";
import LoginPage from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/User/Profile";
import Product from "./pages/Product/Product";
import ProtectedProfile from "./pages/Protected/ProtectedProfile";
import Unauth from "./pages/Unauthorized/Unauth";
import ProtectedRoute from "./pages/Protected/ProtectedRoute";
import WishPage from "./pages/Wishlist/WishPage";
import About from "./pages/About/About";
import NotFound from "./pages/NotFound/NotFound";
import Contact from "./pages/Contact/Contact";
import PreviousPurchase from "./pages/PreviousPurchase/PreviousPurchase";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductsList from "./pages/Dashboard/components/ProductsList";
import ProductForm from "./pages/Dashboard/components/ProductForm";

const App = () => {
    return (
        <Provider store={appStore}>
            <EcommerceProvider>
                <UserProductsProvider>
                    <BrowserRouter>
                        <Toaster position="top-right" />
                        <Routes>
                            <Route path="/" index element={<Home />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/wishlist"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["user", "vendor"]}
                                    >
                                        <WishPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/unauthorized" element={<Unauth />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route
                                path="/products"
                                element={<Products />}
                            ></Route>
                            <Route
                                path="/product/:id"
                                element={<Product />}
                            ></Route>
                            <Route
                                path="/vendor"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={[
                                            "user",
                                            "vendor",
                                            "admin",
                                        ]}
                                    >
                                        <Vendor />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/cart"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["user", "vendor"]}
                                    >
                                        <Cart />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["user", "vendor"]}
                                    >
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["user", "vendor"]}
                                    >
                                        <PreviousPurchase />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Dashboard Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["user", "vendor"]}
                                    >
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            >
                                <Route
                                    index
                                    element={<Navigate to="products" replace />}
                                />
                                <Route
                                    path="products"
                                    element={<ProductsList />}
                                />
                                <Route
                                    path="products/new"
                                    element={<ProductForm />}
                                />
                                <Route
                                    path="products/edit/:id"
                                    element={<ProductForm isEdit />}
                                />
                                <Route
                                    path="orders"
                                    element={<div>My Orders</div>}
                                />
                                <Route path="profile" element={<Profile />} />
                                <Route
                                    path="settings"
                                    element={<div>Settings</div>}
                                />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </UserProductsProvider>
            </EcommerceProvider>
        </Provider>
    );
};

export default App;
