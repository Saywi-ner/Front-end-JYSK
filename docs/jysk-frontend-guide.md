# ⚛️ Frontend — Структура React-проекту

> Стек: React + Axios + Zustand
> Проект: Інтернет-магазин меблів (аналог JYSK)

---

## Структура папок

```
src/
├── api/
│   └── axios.js                # Axios instance — базовий URL, інтерцептори
│
├── stores/
│   ├── authStore.js            # Реєстрація, логін, поточний юзер
│   ├── productStore.js         # Товари, фільтри, деталі, варіанти
│   ├── categoryStore.js        # Категорії
│   ├── roomStore.js            # Кімнати (Спальня, Вітальня…)
│   ├── collectionStore.js      # Колекції/стилі (Скандинавський, Лофт…)
│   ├── orderStore.js           # Замовлення
│   ├── reviewStore.js          # Відгуки
│   └── cartStore.js            # Кошик (локальний стейт, без API)
│
├── pages/
│   ├── HomePage.jsx            # Головна: банер, кімнати, колекції, новинки
│   ├── CatalogPage.jsx         # Каталог товарів з фільтрами
│   ├── ProductDetailPage.jsx   # Сторінка товару + варіанти + відгуки
│   ├── RoomPage.jsx            # Кімната + товари в ній
│   ├── CollectionPage.jsx      # Колекція + товари
│   ├── CartPage.jsx            # Кошик
│   ├── CheckoutPage.jsx        # Оформлення замовлення
│   ├── OrdersPage.jsx          # Мої замовлення
│   ├── OrderDetailPage.jsx     # Деталі замовлення
│   └── LoginPage.jsx
│
├── components/
│   ├── ProductCard.jsx
│   ├── VariantSelector.jsx     # Вибір розміру/кольору на сторінці товару
│   ├── RoomCard.jsx
│   ├── CollectionCard.jsx
│   ├── OrderStatusBadge.jsx
│   └── ...
│
└── App.jsx
```

---

## Axios Instance

```js
// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Автоматично додає JWT токен до кожного запиту
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 — токен протух → чистимо і відправляємо на логін
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Сторе — повний приклад: productStore

> Найбільший стор проекту — містить фільтри, пагінацію, варіанти.

```js
// src/stores/productStore.js

import { create } from "zustand";
import api from "../api/axios";

const useProductStore = create((set) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  items:           [],
  selectedProduct: null,
  totalCount:      0,
  totalPages:      0,
  isLoading:       false,
  error:           null,

  // ─── Actions ──────────────────────────────────────────────────────────────

  // GET /products?categoryId=&roomId=&collectionId=&search=&minPrice=&maxPrice=
  //              &color=&material=&isNew=&onSale=&page=&pageSize=&sortBy=
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/products", { params });
      set({
        items:      data.items,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        isLoading:  false,
      });
    } catch (err) {
      set({ error: "Не вдалося завантажити товари", isLoading: false });
    }
  },

  // GET /products/:id
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ selectedProduct: data, isLoading: false });
    } catch (err) {
      set({ error: "Товар не знайдено", isLoading: false });
    }
  },

  // POST /products  (Admin)
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/products", productData);
      set((state) => ({ items: [data, ...state.items], isLoading: false }));
      return true;
    } catch (err) {
      set({ error: "Помилка створення товару", isLoading: false });
      return false;
    }
  },

  // DELETE /products/:id  (Admin)
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        items:     state.items.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Помилка видалення товару", isLoading: false });
    }
  },
}));

export default useProductStore;
```

---

## Скелети інших сторів

### authStore

```js
// src/stores/authStore.js

import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  customer:  null,
  token:     localStorage.getItem("token") ?? null,
  isLoading: false,
  error:     null,

  register: async (firstName, lastName, email, password, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { firstName, lastName, email, password, phoneNumber });
      localStorage.setItem("token", data.token);
      set({ token: data.token, customer: data.customer, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message ?? "Помилка реєстрації", isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      set({ token: data.token, customer: data.customer, isLoading: false });
      return true;
    } catch (err) {
      set({ error: "Невірний email або пароль", isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/customers/me");
      set({ customer: data, isLoading: false });
    } catch (err) {
      set({ error: "Не вдалося завантажити профіль", isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ customer: null, token: null });
  },
}));

export default useAuthStore;
```

---

### categoryStore

```js
// src/stores/categoryStore.js

import { create } from "zustand";
import api from "../api/axios";

const useCategoryStore = create((set) => ({
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
      set({ error: "Не вдалося завантажити категорії", isLoading: false });
    }
  },

  fetchCategoryById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/categories/${id}`);
      set({ selectedCategory: data, isLoading: false });
    } catch {
      set({ error: "Категорію не знайдено", isLoading: false });
    }
  },
}));

export default useCategoryStore;
```

---

### roomStore

```js
// src/stores/roomStore.js

import { create } from "zustand";
import api from "../api/axios";

const useRoomStore = create((set) => ({
  rooms:        [],
  selectedRoom: null,   // містить room + products[]
  isLoading:    false,
  error:        null,

  // GET /rooms
  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/rooms");
      set({ rooms: data, isLoading: false });
    } catch {
      set({ error: "Не вдалося завантажити кімнати", isLoading: false });
    }
  },

  // GET /rooms/:id  — повертає кімнату разом з товарами
  fetchRoomById: async (id) => {
    set({ isLoading: true, error: null, selectedRoom: null });
    try {
      const { data } = await api.get(`/rooms/${id}`);
      set({ selectedRoom: data, isLoading: false });
    } catch {
      set({ error: "Кімнату не знайдено", isLoading: false });
    }
  },
}));

export default useRoomStore;
```

---

### collectionStore

```js
// src/stores/collectionStore.js

import { create } from "zustand";
import api from "../api/axios";

const useCollectionStore = create((set) => ({
  collections:       [],
  selectedCollection: null,
  isLoading:         false,
  error:             null,

  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/collections");
      set({ collections: data, isLoading: false });
    } catch {
      set({ error: "Не вдалося завантажити колекції", isLoading: false });
    }
  },

  fetchCollectionById: async (id) => {
    set({ isLoading: true, error: null, selectedCollection: null });
    try {
      const { data } = await api.get(`/collections/${id}`);
      set({ selectedCollection: data, isLoading: false });
    } catch {
      set({ error: "Колекцію не знайдено", isLoading: false });
    }
  },
}));

export default useCollectionStore;
```

---

### orderStore

```js
// src/stores/orderStore.js

import { create } from "zustand";
import api from "../api/axios";

const useOrderStore = create((set) => ({
  orders:        [],
  selectedOrder: null,
  isLoading:     false,
  error:         null,

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/orders");
      set({ orders: data, isLoading: false });
    } catch {
      set({ error: "Не вдалося завантажити замовлення", isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null, selectedOrder: null });
    try {
      const { data } = await api.get(`/orders/${id}`);
      set({ selectedOrder: data, isLoading: false });
    } catch {
      set({ error: "Замовлення не знайдено", isLoading: false });
    }
  },

  // items = [{ productId, variantId, quantity }]
  createOrder: async (deliveryAddress, items, comment = "") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/orders", { deliveryAddress, comment, items });
      set((state) => ({ orders: [data, ...state.orders], isLoading: false }));
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message ?? "Помилка оформлення замовлення", isLoading: false });
      return null;
    }
  },
}));

export default useOrderStore;
```

---

### cartStore — кошик (без API, тільки локальний стейт)

```js
// src/stores/cartStore.js
// Кошик не зберігається на сервері — тільки у пам'яті (можна додати localStorage)

import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  // item = { productId, productName, imageUrl, variantId, variantLabel, price, quantity }

  addItem: (item) => {
    const existing = get().items.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      }));
    } else {
      set((state) => ({ items: [...state.items, item] }));
    }
  },

  removeItem: (productId, variantId) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      ),
    }));
  },

  updateQuantity: (productId, variantId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, variantId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.variantId === variantId
          ? { ...i, quantity }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  // Загальна сума
  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  // Кількість позицій для бейджа на іконці кошика
  getCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

export default useCartStore;
```

---

### reviewStore

```js
// src/stores/reviewStore.js

import { create } from "zustand";
import api from "../api/axios";

const useReviewStore = create((set) => ({
  reviews:   [],
  isLoading: false,
  error:     null,

  fetchReviews: async (productId) => {
    set({ isLoading: true, error: null, reviews: [] });
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      set({ reviews: data, isLoading: false });
    } catch {
      set({ error: "Не вдалося завантажити відгуки", isLoading: false });
    }
  },

  addReview: async (productId, rating, comment) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
      set((state) => ({ reviews: [...state.reviews, data], isLoading: false }));
      return true;
    } catch {
      set({ error: "Не вдалося залишити відгук", isLoading: false });
      return false;
    }
  },
}));

export default useReviewStore;
```

---

## Памятка: часті помилки

| ❌ Неправильно | ✅ Правильно |
|----------------|-------------|
| Передавати ціну варіанту в POST /orders | Передавати тільки `variantId` — ціну фіксує бекенд |
| Робити `axios.get(...)` прямо в компоненті | Викликати метод стора |
| Зберігати весь стан у одному сторі | Один стор = один розділ API |
| Не обнуляти `error` перед новим запросом | Завжди `error: null` на початку методу |
| Показувати варіанти тільки як текст | Зробити `VariantSelector` — кнопки з розмірами/кольорами |
| Рахувати суму кошика на бекенді під час оформлення | Бекенд рахує сам по `productId`/`variantId` — не довіряти фронту |

---

## Швидкий старт

```bash
npm create vite@latest jysk-frontend -- --template react
cd jysk-frontend
npm install axios zustand react-router-dom
```

```jsx
// src/main.jsx
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```
