// src/stores/authStore.js
// Регистрация, логин, профиль текущего юзера.
//
// Контракт бэкенда:
//   POST /auth/register {firstName,lastName,email,password,phoneNumber}
//        -> 201 { token, customer: { id(guid), firstName, lastName, email, role } }
//        -> 409 { message } если email занят
//   POST /auth/login {email,password} -> 200 то же самое | 401 { message }
//   GET  /customers/me (JWT) -> { id, firstName, lastName, email, phoneNumber, address, createdAt }

import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  customer:  JSON.parse(localStorage.getItem("customer") ?? "null"),
  profile:   null, // полный профиль из /customers/me
  token:     localStorage.getItem("token") ?? null,
  isLoading: false,
  error:     null,

  register: async ({ firstName, lastName, email, password, phoneNumber }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { firstName, lastName, email, password, phoneNumber });
      localStorage.setItem("token", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      set({ token: data.token, customer: data.customer, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message ?? "Ошибка регистрации", isLoading: false });
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
      set({ error: err.response?.data?.message ?? "Неверный email или пароль", isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/customers/me");
      set({ profile: data, isLoading: false });
    } catch {
      set({ error: "Не удалось загрузить профиль", isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    set({ customer: null, profile: null, token: null });
  },
}));

export default useAuthStore;
