// src/stores/orderStore.js
// Заказы. Все ручки требуют JWT — токен подставляет интерцептор axios.
//
// Контракт бэкенда:
//   GET   /orders            -> [{ id, status, totalAmount, deliveryAddress, createdAt, itemCount }]
//   GET   /orders/{id}       -> + items[{ productId, productName, variantLabel, imageUrl, quantity, unitPrice }]
//   POST  /orders            { deliveryAddress, comment, items:[{productId,variantId,quantity}] } -> 201 деталка
//         409 — не хватает на складе, 400 — товара нет или он снят с продажи
//   GET   /orders/all        (Admin) ?status=&page=&pageSize= -> пагинированный список
//   PATCH /orders/{id}/status (Admin) { status }

import { create } from "zustand";
import api, { asArray, errorMessage } from "../api/axios";

export const ORDER_STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export const STATUS_LABELS = {
  Pending:   "Очікує підтвердження",
  Confirmed: "Підтверджено",
  Shipped:   "Відправлено",
  Delivered: "Доставлено",
  Cancelled: "Скасовано",
};

const useOrderStore = create((set, get) => ({
  orders:        [],
  selectedOrder: null,
  adminOrders:   [],
  adminTotal:    0,
  isLoading:     false,
  error:         null,

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/orders");
      set({ orders: asArray(data), isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Не вдалося завантажити замовлення"), isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null, selectedOrder: null });
    try {
      const { data } = await api.get(`/orders/${id}`);
      set({ selectedOrder: data, isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Замовлення не знайдено"), isLoading: false });
    }
  },

  // Возвращает созданный заказ, а не true/false: страница оформления
  // показывает его номер сразу после успеха.
  createOrder: async ({ deliveryAddress, comment, items }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/orders", { deliveryAddress, comment, items });
      set({ isLoading: false, selectedOrder: data, orders: [] });
      return data;
    } catch (err) {
      set({ error: errorMessage(err, "Не вдалося оформити замовлення"), isLoading: false });
      return null;
    }
  },

  fetchAllOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/orders/all", { params });
      set({ adminOrders: asArray(data.items), adminTotal: data.totalCount ?? 0, isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Не вдалося завантажити замовлення"), isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    set({ error: null });
    try {
      await api.patch(`/orders/${id}/status`, { status });
      set({
        adminOrders: get().adminOrders.map((o) => (o.id === id ? { ...o, status } : o)),
        orders:      get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
      });
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Не вдалося змінити статус") });
      return false;
    }
  },
}));

export default useOrderStore;
