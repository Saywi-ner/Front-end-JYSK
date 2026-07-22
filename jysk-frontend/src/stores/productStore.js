// src/stores/productStore.js
// Один стор = один раздел API. Здесь — только товары.
//
// Контракт бэкенда (commit f44fb45):
//   GET    /products?categoryId=&search=&minPrice=&maxPrice=&color=&material=&isNew=&onSale=&page=&pageSize=&sortBy=
//          -> { items: [...], totalCount, page, pageSize, totalPages }
//          item = { id(guid), name, price, oldPrice, articleNumber, brand, color, material,
//                   dimensions, isNew, categoryId, categoryName, mainImageUrl, avgRating, reviewCount }
//   GET    /products/{id} -> деталка + images[{id,imageUrl,isMain}] + variants[] + avgRating + reviewCount
//   POST   /products      -> created (сырая сущность — после создания перезагружаем список)
//   PUT    /products/{id} -> updated (сырая сущность)
//   DELETE /products/{id} -> 204

import { create } from "zustand";
import api from "../api/axios";

const useProductStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────────────────
  items:           [],
  selectedProduct: null,
  homepage:        null, // { newArrivals[], onSale[], recommended[] }
  totalCount:      0,
  page:            1,
  pageSize:        20,
  totalPages:      0,
  lastParams:      {},   // последние фильтры — чтобы перезагружать список после мутаций
  isLoading:       false,
  isHomeLoading:   false,
  error:           null,

  // ─── Actions ────────────────────────────────────────────────────────────

  // GET /products/homepage -> { newArrivals, onSale, recommended }
  fetchHomepage: async () => {
    set({ isHomeLoading: true, error: null });
    try {
      const { data } = await api.get("/products/homepage");
      set({ homepage: data, isHomeLoading: false });
    } catch {
      set({ error: "Не удалось загрузить главную", isHomeLoading: false });
    }
  },

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null, lastParams: params });
    try {
      const { data } = await api.get("/products", { params });
      set({
        items:      data.items,
        totalCount: data.totalCount,
        page:       data.page,
        pageSize:   data.pageSize,
        totalPages: data.totalPages,
        isLoading:  false,
      });
    } catch {
      set({ error: "Не удалось загрузить товары", isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ selectedProduct: data, isLoading: false });
    } catch {
      set({ error: "Товар не найден", isLoading: false });
    }
  },

  // POST возвращает сырую сущность без categoryName/mainImageUrl,
  // поэтому после мутаций просто перезагружаем список с текущими фильтрами.
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/products", productData);
      await get().fetchProducts(get().lastParams);
      return true;
    } catch {
      set({ error: "Ошибка создания товара", isLoading: false });
      return false;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/products/${id}`, productData);
      // если открыта деталка этого товара — обновим её
      if (get().selectedProduct?.id === id) {
        await get().fetchProductById(id);
      } else {
        set({ isLoading: false });
      }
      return true;
    } catch {
      set({ error: "Ошибка обновления товара", isLoading: false });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        items:     state.items.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch {
      set({ error: "Ошибка удаления товара", isLoading: false });
      return false;
    }
  },
}));

export default useProductStore;
