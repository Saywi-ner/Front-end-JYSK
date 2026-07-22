// src/stores/reviewStore.js
// Отзывы — дочерняя сущность товара.
//
// Контракт бэкенда:
//   GET  /products/{productId}/reviews -> [{ id, rating, comment, createdAt, customerName }]
//   POST /products/{productId}/reviews { rating, comment, customerId(guid) }
//        ВАЖНО: бэк берёт customerId из тела, а не из токена — передаём id залогиненного юзера.

import { create } from "zustand";
import api from "../api/axios";

const useReviewStore = create((set, get) => ({
  reviews:   [],
  isLoading: false,
  error:     null,

  fetchReviews: async (productId) => {
    set({ isLoading: true, error: null, reviews: [] });
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      set({ reviews: data, isLoading: false });
    } catch {
      set({ error: "Не удалось загрузить отзывы", isLoading: false });
    }
  },

  // POST возвращает сырую сущность без customerName — перезагружаем список.
  addReview: async (productId, rating, comment, customerId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment, customerId });
      await get().fetchReviews(productId);
      return true;
    } catch {
      set({ error: "Не удалось оставить отзыв", isLoading: false });
      return false;
    }
  },
}));

export default useReviewStore;
