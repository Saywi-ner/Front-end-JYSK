// src/components/CategoryAdmin.jsx
// Адмінський CRUD категорій (POST/PUT/DELETE /categories). Схований у <details>.

import { useState } from "react";
import useCategoryStore from "../stores/categoryStore";
import "./CategoryAdmin.css";

const empty = { name: "", description: "", imageUrl: "", parentCategoryId: "" };

const toPayload = (form) => ({
  name: form.name,
  description: form.description || null,
  imageUrl: form.imageUrl || null,
  parentCategoryId: form.parentCategoryId ? Number(form.parentCategoryId) : null,
});

const CategoryAdmin = ({ categories }) => {
  const { createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [newCat, setNewCat] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(empty);

  const handleCreate = async (e) => {
    e.preventDefault();
    const ok = await createCategory(toPayload(newCat));
    if (ok) setNewCat(empty);
  };

  const startEdit = (c) => {
    setEditId(c.id);
    setEditForm({
      name: c.name, description: c.description ?? "",
      imageUrl: c.imageUrl ?? "", parentCategoryId: c.parentCategoryId ?? "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const ok = await updateCategory(editId, toPayload(editForm));
    if (ok) setEditId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Видалити категорію?")) await deleteCategory(id);
  };

  return (
    <details className="cat-admin">
      <summary className="cat-admin__summary">⚙ Керування категоріями (адмін)</summary>

      <div className="cat-admin__body">
        <ul className="cat-admin__list">
          {categories.map((c) => (
            <li key={c.id} className="cat-admin__item">
              {editId === c.id ? (
                <form className="cat-admin__edit" onSubmit={handleUpdate}>
                  <input
                    required className="field" value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <select
                    className="field" value={editForm.parentCategoryId}
                    onChange={(e) => setEditForm({ ...editForm, parentCategoryId: e.target.value })}
                  >
                    <option value="">— без батьківської —</option>
                    {categories.filter((x) => x.id !== c.id).map((x) => (
                      <option key={x.id} value={x.id}>{x.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn--primary">Зберегти</button>
                  <button type="button" className="btn btn--outline" onClick={() => setEditId(null)}>
                    Скасувати
                  </button>
                </form>
              ) : (
                <div className="cat-admin__view">
                  <span>
                    <b>{c.name}</b>
                    <span className="cat-admin__meta"> #{c.id}
                      {c.parentCategoryId ? ` · підкатегорія #${c.parentCategoryId}` : ""}
                    </span>
                  </span>
                  <span className="cat-admin__actions">
                    <button type="button" onClick={() => startEdit(c)} aria-label="Редагувати">✏️</button>
                    <button type="button" onClick={() => handleDelete(c.id)} aria-label="Видалити">🗑</button>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>

        <form className="cat-admin__create" onSubmit={handleCreate}>
          <h3 className="cat-admin__create-title">Нова категорія</h3>
          <input
            required className="field" placeholder="Назва"
            value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
          />
          <input
            className="field" placeholder="Опис"
            value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
          />
          <input
            className="field" placeholder="URL зображення"
            value={newCat.imageUrl} onChange={(e) => setNewCat({ ...newCat, imageUrl: e.target.value })}
          />
          <select
            className="field" value={newCat.parentCategoryId}
            onChange={(e) => setNewCat({ ...newCat, parentCategoryId: e.target.value })}
          >
            <option value="">— без батьківської —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn--primary">Створити</button>
        </form>
      </div>
    </details>
  );
};

export default CategoryAdmin;
