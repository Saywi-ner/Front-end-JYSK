// src/stores/categoryStore.js
// Категории: полный CRUD.
//
// Контракт бэкенда:
//   GET    /categories      -> [{ id(int), name, description, imageUrl, parentCategoryId }]
//   GET    /categories/{id} -> то же + subCategories[]
//   POST   /categories      {name, description, imageUrl, parentCategoryId}
//   PUT    /categories/{id} (те же поля)
//   DELETE /categories/{id} -> 204

import { create } from "zustand";
import api from "../api/axios";

const useCategoryStore = create((set, get) => ({
  categories:       [],
  selectedCategory: null,
  isLoading:        false,
  error:            null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/categories");
      set({ categories: data, isLoading: false });
    } catch {
      set({ error: "Не удалось загрузить категории", isLoading: false });
    }
  },

  fetchCategoryById: async (id) => {
    set({ isLoading: true, error: null, selectedCategory: null });
    try {
      const { data } = await api.get(`/categories/${id}`);
      set({ selectedCategory: data, isLoading: false });
    } catch {
      set({ error: "Категория не найдена", isLoading: false });
    }
  },

  // POST/PUT возвращают сырую сущность — после мутаций перезагружаем список.
  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/categories", categoryData);
      await get().fetchCategories();
      return true;
    } catch {
      set({ error: "Ошибка создания категории", isLoading: false });
      return false;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/categories/${id}`, categoryData);
      await get().fetchCategories();
      return true;
    } catch {
      set({ error: "Ошибка обновления категории", isLoading: false });
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
    } catch {
      set({ error: "Ошибка удаления категории (возможно, в ней есть товары)", isLoading: false });
      return false;
    }
  },
}));

export default useCategoryStore;
