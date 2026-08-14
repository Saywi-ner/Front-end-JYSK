// src/pages/admin/AdminProductsPage.jsx
// CRUD товарів. Читання — публічне, створення/редагування/видалення
// закриті на бекенді ролью Admin; тут лише інтерфейс до них.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../stores/productStore";
import useCategoryStore from "../../stores/categoryStore";
import api, { errorMessage } from "../../api/axios";
import { formatPrice } from "../../utils/format";

const PAGE_SIZE = 20;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  stock: "",
  brand: "",
  material: "",
  color: "",
  dimensions: "",
  articleNumber: "",
  isNew: false,
  isActive: true,
  categoryId: "",
};

const AdminProductsPage = () => {
  const { items, totalCount, page, totalPages, isLoading, error,
          fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [currentPage, setCurrentPage] = useState(1);
  // null — форма закрита; { id: null } — створення; { id } — редагування.
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts({ page: currentPage, pageSize: PAGE_SIZE, sortBy: "newest" });
  }, [fetchProducts, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const setField = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const startCreate = () => {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setFormError(null);
    setEditing({ id: null });
  };

  const startEdit = async (product) => {
    setFormError(null);
    setEditing({ id: product.id });
    // Список не віддає stock та isActive, а PUT перезаписує геть усі поля —
    // відправити форму без них означало б обнулити залишок. Тому беремо
    // повну картку товару.
    try {
      const { data } = await api.get(`/products/${product.id}`);
      setForm({
        name: data.name ?? "",
        description: data.description ?? "",
        price: data.price ?? "",
        oldPrice: data.oldPrice ?? "",
        stock: data.stock ?? 0,
        brand: data.brand ?? "",
        material: data.material ?? "",
        color: data.color ?? "",
        dimensions: data.dimensions ?? "",
        articleNumber: data.articleNumber ?? "",
        isNew: Boolean(data.isNew),
        isActive: data.isActive !== false,
        categoryId: data.categoryId ?? "",
      });
    } catch (e) {
      setFormError(errorMessage(e, "Не вдалося завантажити товар"));
    }
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
      price: Number(form.price),
      // Порожнє поле — це «знижки немає», а не нуль.
      oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice),
      stock: Number(form.stock) || 0,
      brand: form.brand.trim() || null,
      material: form.material.trim() || null,
      color: form.color.trim() || null,
      dimensions: form.dimensions.trim() || null,
      articleNumber: form.articleNumber.trim() || null,
      isNew: form.isNew,
      isActive: form.isActive,
      categoryId: Number(form.categoryId),
    };

    const ok = editing.id
      ? await updateProduct(editing.id, payload)
      : await createProduct(payload);

    setIsSaving(false);

    if (ok) {
      closeForm();
      fetchProducts({ page: currentPage, pageSize: PAGE_SIZE, sortBy: "newest" });
    } else {
      setFormError(useProductStore.getState().error ?? "Не вдалося зберегти товар");
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Видалити «${product.name}»?`)) return;
    await deleteProduct(product.id);
    fetchProducts({ page: currentPage, pageSize: PAGE_SIZE, sortBy: "newest" });
  };

  return (
    <>
      <div className="admin__section-head">
        <h2 className="admin__section-title">Товари</h2>
        <div className="admin__head-actions">
          <span className="admin__count">Усього: {totalCount}</span>
          <button type="button" className="btn btn--primary" onClick={startCreate}>
            Додати товар
          </button>
        </div>
      </div>

      {error && !editing && <p className="admin__error">{error}</p>}

      {editing && (
        <form className="admin-form" onSubmit={submit}>
          <h3 className="admin-form__title">
            {editing.id ? "Редагувати товар" : "Новий товар"}
          </h3>

          {formError && <p className="admin__error">{formError}</p>}

          <div className="admin-form__grid">
            <label className="admin-form__field admin-form__field--wide">
              <span>Назва *</span>
              <input className="field" value={form.name} onChange={setField("name")} required maxLength={255} />
            </label>

            <label className="admin-form__field admin-form__field--wide">
              <span>Опис</span>
              <textarea className="field" rows="2" value={form.description} onChange={setField("description")} maxLength={2000} />
            </label>

            <label className="admin-form__field">
              <span>Категорія *</span>
              <select className="field" value={form.categoryId} onChange={setField("categoryId")} required>
                <option value="">— оберіть —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="admin-form__field">
              <span>Артикул</span>
              <input className="field" value={form.articleNumber} onChange={setField("articleNumber")} maxLength={50} />
            </label>

            <label className="admin-form__field">
              <span>Ціна, грн *</span>
              <input className="field" type="number" min="0" step="0.01" value={form.price} onChange={setField("price")} required />
            </label>

            <label className="admin-form__field">
              <span>Стара ціна</span>
              <input className="field" type="number" min="0" step="0.01" value={form.oldPrice} onChange={setField("oldPrice")} />
            </label>

            <label className="admin-form__field">
              <span>Залишок</span>
              <input className="field" type="number" min="0" value={form.stock} onChange={setField("stock")} />
            </label>

            <label className="admin-form__field">
              <span>Бренд</span>
              <input className="field" value={form.brand} onChange={setField("brand")} maxLength={100} />
            </label>

            <label className="admin-form__field">
              <span>Матеріал</span>
              <input className="field" value={form.material} onChange={setField("material")} maxLength={100} />
            </label>

            <label className="admin-form__field">
              <span>Колір</span>
              <input className="field" value={form.color} onChange={setField("color")} maxLength={50} />
            </label>

            <label className="admin-form__field">
              <span>Габарити</span>
              <input className="field" value={form.dimensions} onChange={setField("dimensions")} maxLength={100} />
            </label>
          </div>

          <div className="admin-form__checks">
            <label className="admin-form__check">
              <input type="checkbox" checked={form.isNew} onChange={setField("isNew")} />
              Новинка
            </label>
            <label className="admin-form__check">
              <input type="checkbox" checked={form.isActive} onChange={setField("isActive")} />
              В продажу
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

      {!isLoading && items.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Артикул</th>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ціна</th>
                <th aria-label="Дії" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="admin-table__mono">{p.articleNumber || "—"}</td>
                  <td><Link to={`/products/${p.id}`}>{p.name}</Link></td>
                  <td>{p.categoryName}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td className="admin-table__actions">
                    <button type="button" className="admin-action" onClick={() => startEdit(p)}>
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="admin-action admin-action--danger"
                      onClick={() => remove(p)}
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

      {totalPages > 1 && (
        <div className="admin__pager">
          <button type="button" disabled={page <= 1} onClick={() => setCurrentPage(page - 1)}>
            Назад
          </button>
          <span>Сторінка {page} з {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setCurrentPage(page + 1)}>
            Далі
          </button>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
