// src/stores/categoryStore.js
// Категории: полный CRUD (мутации — только для роли Admin).
//
// Контракт бэкенда:
//   GET    /categories      -> [{ id(int), name, description, imageUrl, parentCategoryId }]
//   GET    /categories/{id} -> то же + subCategories[]
//   POST   /categories      {name, description, imageUrl, parentCategoryId}
//   PUT    /categories/{id} (те же поля)
//   DELETE /categories/{id} -> 204 | 409 если есть товары или подкатегории

import { create } from "zustand";
import api, { asArray, errorMessage } from "../api/axios";

const useCategoryStore = create((set, get) => ({
  categories:       [],
  selectedCategory: null,
  isLoading:        false,
  error:            null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/categories");
      // asArray, а не data напрямую: при недоступном бэкенде сюда прилетал HTML,
      // и categories.filter(...) в рендере валил всю страницу.
      set({ categories: asArray(data), isLoading: false });
    } catch (err) {
      set({ categories: [], error: errorMessage(err, "Не удалось загрузить категории"), isLoading: false });
    }
  },

  fetchCategoryById: async (id) => {
    set({ isLoading: true, error: null, selectedCategory: null });
    try {
      const { data } = await api.get(`/categories/${id}`);
      set({ selectedCategory: data, isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Категория не найдена"), isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/categories", categoryData);
      await get().fetchCategories();
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Ошибка создания категории"), isLoading: false });
      return false;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/categories/${id}`, categoryData);
      await get().fetchCategories();
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Ошибка обновления категории"), isLoading: false });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading:  false,
      }));
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Ошибка удаления категории"), isLoading: false });
      return false;
    }
  },
}));

export default useCategoryStore;
