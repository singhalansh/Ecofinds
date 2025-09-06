import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Vendor from "./pages/Vendor/Vendor";
import Cart from "./pages/Cart/Cart";
import { appStore } from "./store/store";
import { Provider, useSelector } from "react-redux";
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
import "./App.css";
import Contact from "./pages/Contact/Contact";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import ProductsList from "./pages/UserDashboard/components/ProductsList";
import ProductForm from "./pages/UserDashboard/components/ProductForm";

const App = () => {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor"]}>
                <WishPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />}></Route>
          <Route path="/product/:id" element={<Product />}></Route>
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <Vendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm isEdit />} />
            <Route path="orders" element={<div>My Orders</div>} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
