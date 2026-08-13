// src/stores/showcaseStore.js
// Кімнати (/rooms) и коллекции (/collections) — один и тот же ресурс с разными
// URL, поэтому одна фабрика стора на оба, а не два копипаст-файла.
//
// Контракт бэкенда:
//   GET  /rooms | /collections            -> [{ id, name, description, coverImageUrl }]
//   GET  /rooms/{id} | /collections/{id}  -> + products[{ id, name, price, mainImageUrl }]
//   POST /rooms | /collections            (Admin) { name, description, coverImageUrl }

import { create } from "zustand";
import api, { asArray, errorMessage } from "../api/axios";

const createShowcaseStore = (resource, label) =>
  create((set) => ({
    items:    [],
    selected: null,
    isLoading: false,
    error:     null,

    fetchAll: async () => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await api.get(`/${resource}`);
        set({ items: asArray(data), isLoading: false });
      } catch (err) {
        set({ error: errorMessage(err, `Не вдалося завантажити ${label}`), isLoading: false });
      }
    },

    fetchById: async (id) => {
      set({ isLoading: true, error: null, selected: null });
      try {
        const { data } = await api.get(`/${resource}/${id}`);
        set({ selected: data, isLoading: false });
      } catch (err) {
        set({ error: errorMessage(err, "Розділ не знайдено"), isLoading: false });
      }
    },
  }));

export const useRoomStore = createShowcaseStore("rooms", "кімнати");
export const useCollectionStore = createShowcaseStore("collections", "колекції");
