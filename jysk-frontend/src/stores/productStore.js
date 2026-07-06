// src/stores/productStore.js
// Один стор = один раздел API. Здесь — только товары.
//
// Реальный контракт бэкенда (на сегодня):
//   GET  /products            -> массив [{ id, name, price, imageUrl }]   (?categoryId= — опционально)
//   GET  /products/{id:guid}  -> { id, name, description, price, categoryName, images: string[] }
//
// POST/PUT/DELETE напарник ещё дописывает — методы ниже уже готовы под них,
// но до появления эндпоинтов вернут ошибку (это норм, страница их пока не вызывает).

import { create } from "zustand";
import api from "../api/axios";

const useProductStore = create((set) => ({
  // ─── State ──────────────────────────────────────────────────────────────
  items:           [],
  selectedProduct: null,
  isLoading:       false,
  error:           null,

  // ─── Actions ────────────────────────────────────────────────────────────

  // GET /products?categoryId=
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/products", { params });
      // Бэк сейчас отдаёт чистый массив. Если позже сделают пагинацию
      // ({ items, totalCount, ... }) — этот разбор переживёт оба варианта.
      const items = Array.isArray(data) ? data : (data.items ?? []);
      set({ items, isLoading: false });
    } catch (err) {
      set({ error: "Не удалось загрузить товары", isLoading: false });
    }
  },

  // GET /products/:id
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ selectedProduct: data, isLoading: false });
    } catch (err) {
      set({ error: "Товар не найден", isLoading: false });
    }
  },

  // POST /products  (Admin) — появится, когда напарник доделает эндпоинт
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/products", productData);
      set((state) => ({ items: [data, ...state.items], isLoading: false }));
      return true;
    } catch (err) {
      set({ error: "Ошибка создания товара", isLoading: false });
      return false;
    }
  },

  // PUT /products/:id  (Admin)
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      set((state) => ({
        items:     state.items.map((p) => (p.id === id ? data : p)),
        isLoading: false,
      }));
      return true;
    } catch (err) {
      set({ error: "Ошибка обновления товара", isLoading: false });
      return false;
    }
  },

  // DELETE /products/:id  (Admin)
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        items:     state.items.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (err) {
      set({ error: "Ошибка удаления товара", isLoading: false });
      return false;
    }
  },
}));

export default useProductStore;
