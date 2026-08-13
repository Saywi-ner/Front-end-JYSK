// src/stores/authStore.js
// Регистрация, логин, профиль текущего юзера.
//
// Контракт бэкенда:
//   POST /auth/register {firstName,lastName,email,password,phoneNumber}
//        -> 201 { token, customer: { id(guid), firstName, lastName, email, role } }
//        -> 409 { message } если email занят
//   POST /auth/login {email,password} -> 200 то же самое | 401 { message }
//   GET  /customers/me (JWT) -> { id, firstName, lastName, email, phoneNumber, address, createdAt }
//   PUT  /customers/me (JWT) {firstName,lastName,phoneNumber,address} -> обновлённый профиль

import { create } from "zustand";
import api, { errorMessage } from "../api/axios";

// localStorage может содержать мусор от прошлых версий — иначе JSON.parse
// уронил бы приложение ещё до первого рендера.
const readStoredCustomer = () => {
  try {
    const raw = localStorage.getItem("customer");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    localStorage.removeItem("customer");
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  customer:  readStoredCustomer(),
  profile:   null, // полный профиль из /customers/me
  token:     localStorage.getItem("token") ?? null,
  isLoading: false,
  error:     null,

  // Роль приходит в теле логина и лежит в JWT: сервер всё равно проверяет её сам,
  // здесь она нужна только чтобы не показывать гостю админские формы.
  isAdmin: () => get().customer?.role === "Admin",

  register: async ({ firstName, lastName, email, password, phoneNumber }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { firstName, lastName, email, password, phoneNumber });
      localStorage.setItem("token", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      set({ token: data.token, customer: data.customer, isLoading: false });
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Ошибка регистрации"), isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      set({ token: data.token, customer: data.customer, isLoading: false });
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Неверный email или пароль"), isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/customers/me");
      set({ profile: data, isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось загрузить профиль"), isLoading: false });
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put("/customers/me", payload);
      // Имя в шапке берётся из customer, поэтому синхронизируем обе копии.
      const customer = { ...get().customer, firstName: data.firstName, lastName: data.lastName };
      localStorage.setItem("customer", JSON.stringify(customer));
      set({ profile: data, customer, isLoading: false });
      return true;
    } catch (err) {
      set({ error: errorMessage(err, "Не удалось сохранить профиль"), isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    set({ customer: null, profile: null, token: null, error: null });
  },
}));

export default useAuthStore;
