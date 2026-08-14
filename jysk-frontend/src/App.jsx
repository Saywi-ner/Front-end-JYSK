// src/App.jsx — каркас застосунку + маршрути.

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import WishlistPage from "./pages/WishlistPage";
import { RoomsPage, RoomDetailPage, CollectionsPage, CollectionDetailPage } from "./pages/ShowcasePages";
import InfoPage from "./pages/InfoPage";
import NotFoundPage from "./pages/NotFoundPage";
import { INFO_PAGES } from "./content/infoPages";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/search" element={<CatalogPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Маршрути, які без токена все одно повернули б 401 з бекенда. */}
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
          </Route>

          {/* Адмінка: спільний каркас із бічним меню, розділи — вкладені
              маршрути. Замовлення лишаються за тією ж адресою, що й раніше. */}
          <Route element={<RequireAuth adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
            </Route>
          </Route>

          {/* Інформаційні сторінки будуються зі списку контенту —
              додати нову означає дописати об'єкт у infoPages.js. */}
          {INFO_PAGES.map((page) => (
            <Route
              key={page.slug}
              path={page.path}
              element={<InfoPage slug={page.slug} />}
            />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
