// src/stores/reviewStore.js
// Отзывы — дочерняя сущность товара.
//
// Контракт бэкенда:
//   GET  /products/{productId}/reviews -> [{ id, rating, comment, createdAt, customerName }]
//   POST /products/{productId}/reviews { rating, comment }  (требует JWT)
//        Автора бэкенд берёт из токена: раньше customerId шёл в теле запроса,
//        и отзыв можно было подписать чужим id.

import { create } from "zustand";
import api, { asArray, errorMessage } from "../api/axios";

const useReviewStore = create((set, get) => ({
  reviews:   [],
  isLoading: false,
  error:     null,

  fetchReviews: async (productId) => {
    set({ isLoading: true, error: null, reviews: [] });
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      set({ reviews: asArray(data), isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось загрузить отзывы"), isLoading: false });
    }
  },

  addReview: async (productId, rating, comment) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      await get().fetchReviews(productId);
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось оставить отзыв"), isLoading: false });
      return false;
    }
  },
}));

export default useReviewStore;
