// src/stores/wishlistStore.js
// Избранное. Серверного ресурса под него в контракте нет, поэтому — localStorage.
// Храним карточки целиком: иначе страницу «Обране» пришлось бы собирать
// отдельным запросом на каждый товар.

import { create } from "zustand";

const STORAGE_KEY = "wishlist";

const readList = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const persist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
};

const useWishlistStore = create((set, get) => ({
  items: readList(),

  has: (productId) => get().items.some((i) => i.id === productId),

  toggle: (product) => {
    const items = get().has(product.id)
      ? get().items.filter((i) => i.id !== product.id)
      : [...get().items, product];
    set({ items: persist(items) });
  },

  remove: (productId) => set({ items: persist(get().items.filter((i) => i.id !== productId)) }),

  clear: () => set({ items: persist([]) }),
}));

export default useWishlistStore;
