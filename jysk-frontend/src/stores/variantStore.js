// src/stores/variantStore.js
// Варианты (размер/цвет) — дочерняя сущность товара. Мутации только для Admin.
//
// Контракт бэкенда:
//   GET    /products/{productId}/variants -> [{ id(int), label, color, size, price, stock }]
//   POST   /products/{productId}/variants { color, size, label, price, stock } -> созданный вариант
//   DELETE /products/{productId}/variants/{variantId} -> 204

import { create } from "zustand";
import api, { asArray, errorMessage } from "../api/axios";

const useVariantStore = create((set) => ({
  variants:  [],
  isLoading: false,
  error:     null,

  fetchVariants: async (productId) => {
    set({ isLoading: true, error: null, variants: [] });
    try {
      const { data } = await api.get(`/products/${productId}/variants`);
      set({ variants: asArray(data), isLoading: false });
    } catch (err) {
      set({ variants: [], error: errorMessage(err, "Не удалось загрузить варианты"), isLoading: false });
    }
  },

  addVariant: async (productId, variantData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/products/${productId}/variants`, variantData);
      set((state) => ({ variants: [...state.variants, data], isLoading: false }));
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось добавить вариант"), isLoading: false });
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
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось удалить вариант"), isLoading: false });
      return false;
    }
  },
}));

export default useVariantStore;
