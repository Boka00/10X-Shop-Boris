import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import CatalogPage from '../pages/CatalogPage';
import NotFoundPage from '../pages/NotFound';
import LoginPage from '../pages/LoginPage';
import CartPage from '../pages/CartPage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import ProfilePage from '../pages/ProfilePage';
import OrderPage from '../pages/OrderPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/products/:id" element={<ProductPage/>} />
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <OrderPage/>
          </ProtectedRoute>
        }/>
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderPage/>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        } />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage/>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}