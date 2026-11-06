import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

const CatalogPage = lazy(() => import("../pages/CatalogPage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFound"));

export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm font-medium text-slate-500">
          Loading page...
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;