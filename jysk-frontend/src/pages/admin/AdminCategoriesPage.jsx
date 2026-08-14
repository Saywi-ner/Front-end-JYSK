// src/pages/admin/AdminCategoriesPage.jsx
// CRUD категорій. Мутації на бекенді закриті ролью Admin.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCategoryStore from "../../stores/categoryStore";

const emptyForm = { name: "", description: "", imageUrl: "", parentCategoryId: "" };

const AdminCategoriesPage = () => {
  const { categories, isLoading, error,
          fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startCreate = () => {
    setForm(emptyForm);
    setFormError(null);
    setEditing({ id: null });
  };

  const startEdit = (category) => {
    setForm({
      name: category.name ?? "",
      description: category.description ?? "",
      imageUrl: category.imageUrl ?? "",
      parentCategoryId: category.parentCategoryId ?? "",
    });
    setFormError(null);
    setEditing({ id: category.id });
  };

  const closeForm = () => {
    setEditing(null);
    setFormError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      parentCategoryId: form.parentCategoryId === "" ? null : Number(form.parentCategoryId),
    };

    const ok = editing.id
      ? await updateCategory(editing.id, payload)
      : await createCategory(payload);

    setIsSaving(false);

    if (ok) closeForm();
    else setFormError(useCategoryStore.getState().error ?? "Не вдалося зберегти категорію");
  };

  const remove = async (category) => {
    // Бекенд не дасть видалити категорію з товарами — попереджаємо заздалегідь.
    if (!window.confirm(`Видалити категорію «${category.name}»?`)) return;
    await deleteCategory(category.id);
  };

  // Батьком не може бути сама категорія — інакше вийшло б кільце.
  const parentOptions = categories.filter((c) => c.id !== editing?.id);

  return (
    <>
      <div className="admin__section-head">
        <h2 className="admin__section-title">Категорії</h2>
        <div className="admin__head-actions">
          <span className="admin__count">Усього: {categories.length}</span>
          <button type="button" className="btn btn--primary" onClick={startCreate}>
            Додати категорію
          </button>
        </div>
      </div>

      {error && !editing && <p className="admin__error">{error}</p>}

      {editing && (
        <form className="admin-form" onSubmit={submit}>
          <h3 className="admin-form__title">
            {editing.id ? "Редагувати категорію" : "Нова категорія"}
          </h3>

          {formError && <p className="admin__error">{formError}</p>}

          <div className="admin-form__grid">
            <label className="admin-form__field admin-form__field--wide">
              <span>Назва *</span>
              <input className="field" value={form.name} onChange={setField("name")} required maxLength={150} />
            </label>

            <label className="admin-form__field admin-form__field--wide">
              <span>Опис</span>
              <textarea className="field" rows="2" value={form.description} onChange={setField("description")} maxLength={500} />
            </label>

            <label className="admin-form__field admin-form__field--wide">
              <span>Посилання на обкладинку</span>
              <input className="field" type="url" value={form.imageUrl} onChange={setField("imageUrl")} maxLength={255} placeholder="https://…" />
            </label>

            <label className="admin-form__field">
              <span>Батьківська категорія</span>
              <select className="field" value={form.parentCategoryId} onChange={setField("parentCategoryId")}>
                <option value="">— немає —</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--primary" disabled={isSaving}>
              {isSaving ? "Збереження…" : editing.id ? "Зберегти" : "Створити"}
            </button>
            <button type="button" className="btn btn--outline" onClick={closeForm}>
              Скасувати
            </button>
          </div>
        </form>
      )}

      {isLoading && <p className="admin__muted">Завантаження…</p>}

      {!isLoading && categories.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Опис</th>
                <th>Товари</th>
                <th aria-label="Дії" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="admin-table__mono">{c.id}</td>
                  <td>{c.name}</td>
                  <td className="admin-table__muted">{c.description || "—"}</td>
                  <td><Link to={`/catalog?categoryId=${c.id}`}>Переглянути</Link></td>
                  <td className="admin-table__actions">
                    <button type="button" className="admin-action" onClick={() => startEdit(c)}>
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="admin-action admin-action--danger"
                      onClick={() => remove(c)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminCategoriesPage;
