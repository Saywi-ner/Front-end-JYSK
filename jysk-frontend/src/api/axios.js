import axios from "axios";

// Без .env.local baseURL раніше ставав undefined, і всі запити летіли на
// origin самого Vite: у відповідь приходив HTML, стори писали в state не масив,
// і сторінка падала на categories.filter is not a function.
// Тому — явний дефолт на http-профіль бекенда.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5118/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Автоматически добавляет JWT токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 — токен протух -> чистим и отправляем на логин.
// Исключение: 401 от самого /auth/login (неверный пароль) — его должна показать форма.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
      // Уже на /login — второй редирект только зациклил бы страницу.
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Единый разбор ошибки: бэк отдаёт { message }, ASP.NET-валидация — { errors: {...} }.
export const errorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data) return data;
  if (data?.message) return data.message;

  const validation = data?.errors;
  if (validation) {
    const first = Object.values(validation).flat()[0];
    if (first) return first;
  }

  if (error?.code === "ERR_NETWORK") return "Бекенд недоступний. Запустіть API на " + API_BASE_URL;
  return fallback;
};

// Ответ списка всегда должен быть массивом: если бэк или прокси вернул что-то
// другое, лучше пустой список, чем падение на .filter/.map в рендере.
export const asArray = (value) => (Array.isArray(value) ? value : []);

export default api;
