// src/stores/productStore.js
// Один стор = один раздел API. Здесь — только товары.
//
// Контракт бэкенда:
//   GET    /products?categoryId=&roomId=&collectionId=&search=&minPrice=&maxPrice=
//                   &color=&material=&isNew=&onSale=&page=&pageSize=&sortBy=
//          -> { items: [...], totalCount, page, pageSize, totalPages }
//          item = { id(guid), name, description, price, oldPrice, articleNumber, brand, color,
//                   material, dimensions, isNew, categoryId, categoryName, mainImageUrl,
//                   avgRating, reviewCount }
//   GET    /products/{id} -> деталка + images[] + variants[] + relatedProducts[]
//   POST   /products      (Admin) -> created (сырая сущность — после создания перезагружаем список)
//   PUT    /products/{id} (Admin) -> updated (сырая сущность)
//   DELETE /products/{id} (Admin) -> 204 | 409 если товар уже в заказах (тогда он снят с продажи)

import { create } from "zustand";
import api, { asArray, errorMessage } from "../api/axios";

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
      set({
        homepage: {
          newArrivals: asArray(data?.newArrivals),
          onSale:      asArray(data?.onSale),
          recommended: asArray(data?.recommended),
        },
        isHomeLoading: false,
      });
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось загрузить главную"), isHomeLoading: false });
    }
  },

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null, lastParams: params });
    try {
      const { data } = await api.get("/products", { params });
      set({
        items:      asArray(data?.items),
        totalCount: data?.totalCount ?? 0,
        page:       data?.page ?? 1,
        pageSize:   data?.pageSize ?? 20,
        totalPages: data?.totalPages ?? 0,
        isLoading:  false,
      });
    } catch (err) {
      set({ items: [], totalCount: 0, totalPages: 0, error: errorMessage(err, "Не удалось загрузить товары"), isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ selectedProduct: data, isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Товар не найден"), isLoading: false });
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
    } catch (err) {
      set({ error: errorMessage(err, "Ошибка создания товара"), isLoading: false });
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
    } catch (err) {
      set({ error: errorMessage(err, "Ошибка обновления товара"), isLoading: false });
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
    } catch (err) {
      // 409 — товар есть в заказах: бэкенд снял его с продажи вместо удаления,
      // поэтому список всё равно нужно перечитать.
      if (err.response?.status === 409) {
        await get().fetchProducts(get().lastParams);
        set({ error: errorMessage(err, "Товар знято з продажу") });
        return true;
      }
      set({ error: errorMessage(err, "Ошибка удаления товара"), isLoading: false });
      return false;
    }
  },
}));

export default useProductStore;
