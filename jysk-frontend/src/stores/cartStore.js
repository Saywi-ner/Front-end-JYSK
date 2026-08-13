// src/stores/cartStore.js
// Корзина живёт на клиенте: у бэкенда нет ресурса /cart, заказ создаётся
// одним POST /orders со списком позиций. Поэтому состояние держим в
// localStorage — иначе корзина терялась бы на каждом обновлении страницы.
//
// Цены в позициях — только для показа итога. Настоящую цену при оформлении
// проставляет бэкенд из базы, тело запроса на неё не влияет.

import { create } from "zustand";

const STORAGE_KEY = "cart";

const readCart = () => {
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

// Один и тот же товар в разных вариантах — это разные строки корзины.
const lineKey = (productId, variantId) => `${productId}::${variantId ?? ""}`;

const useCartStore = create((set, get) => ({
  items: readCart(),

  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  add: (product, { variant = null, quantity = 1 } = {}) => {
    const key = lineKey(product.id, variant?.id);
    const existing = get().items.find((i) => i.key === key);

    const items = existing
      ? get().items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i))
      : [
          ...get().items,
          {
            key,
            productId:    product.id,
            variantId:    variant?.id ?? null,
            variantLabel: variant?.label || [variant?.size, variant?.color].filter(Boolean).join(" · ") || null,
            name:         product.name,
            price:        variant?.price ?? product.price,
            imageUrl:     product.mainImageUrl ?? product.imageUrl ?? product.images?.[0]?.imageUrl ?? null,
            quantity,
          },
        ];

    set({ items: persist(items) });
  },

  setQuantity: (key, quantity) => {
    if (quantity < 1) return get().remove(key);
    set({ items: persist(get().items.map((i) => (i.key === key ? { ...i, quantity } : i))) });
  },

  remove: (key) => set({ items: persist(get().items.filter((i) => i.key !== key)) }),

  clear: () => set({ items: persist([]) }),

  // Формат, который ждёт POST /orders.
  toOrderItems: () =>
    get().items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      quantity:  i.quantity,
    })),
}));

export default useCartStore;
