import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import CatalogPage from '../pages/CatalogPage';
import NotFoundPage from '../pages/NotFound';
import LoginPage from '../pages/LoginPage';
import CartPage from '../pages/CartPage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/products:id" element={<ProductPage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}