// src/stores/variantStore.js
// Варианты (размер/цвет) — дочерняя сущность товара.
//
// Контракт бэкенда:
//   GET    /products/{productId}/variants -> [{ id(int), label, color, size, price, stock }]
//   POST   /products/{productId}/variants { color, size, label, price, stock } -> созданный вариант
//   DELETE /products/{productId}/variants/{variantId} -> 204

import { create } from "zustand";
import api from "../api/axios";

const useVariantStore = create((set) => ({
  variants:  [],
  isLoading: false,
  error:     null,

  fetchVariants: async (productId) => {
    set({ isLoading: true, error: null, variants: [] });
    try {
      const { data } = await api.get(`/products/${productId}/variants`);
      set({ variants: data, isLoading: false });
    } catch {
      set({ error: "Не удалось загрузить варианты", isLoading: false });
    }
  },

  addVariant: async (productId, variantData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/products/${productId}/variants`, variantData);
      set((state) => ({ variants: [...state.variants, data], isLoading: false }));
      return true;
    } catch {
      set({ error: "Не удалось добавить вариант", isLoading: false });
      return false;
    }
  },

  deleteVariant: async (productId, variantId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${productId}/variants/${variantId}`);
      set((state) => ({
        variants:  state.variants.filter((v) => v.id !== variantId),
        isLoading: false,
      }));
      return true;
    } catch {
      set({ error: "Не удалось удалить вариант", isLoading: false });
      return false;
    }
  },
}));

export default useVariantStore;
