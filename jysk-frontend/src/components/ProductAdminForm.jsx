// src/components/ProductAdminForm.jsx
// Адмінська форма створення товара (POST /products).
// Схована у <details>, щоб не заважати покупцеві, але покривати ендпоінт.

import { useState } from "react";
import useProductStore from "../stores/productStore";
import "./ProductAdminForm.css";

const empty = {
  name: "", description: "", price: "", oldPrice: "", stock: "",
  brand: "", material: "", color: "", dimensions: "", articleNumber: "",
  isNew: false, categoryId: "",
};

const ProductAdminForm = ({ categories }) => {
  const { createProduct, error } = useProductStore();
  const [form, setForm] = useState(empty);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await createProduct({
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock || 0),
      categoryId: Number(form.categoryId),
    });
    if (ok) setForm(empty);
  };

  return (
    <details className="admin-form">
      <summary className="admin-form__summary">＋ Додати товар (адмін)</summary>
      <form className="admin-form__body" onSubmit={handleSubmit}>
        <div className="admin-form__row">
          <input
            required className="field" placeholder="Назва"
            value={form.name} onChange={(e) => set("name", e.target.value)}
          />
          <select
            required className="field"
            value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}
          >
            <option value="">— категорія —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <textarea
          className="field" placeholder="Опис" rows="2"
          value={form.description} onChange={(e) => set("description", e.target.value)}
        />

        <div className="admin-form__row">
          <input
            required type="number" step="0.01" className="field" placeholder="Ціна"
            value={form.price} onChange={(e) => set("price", e.target.value)}
          />
          <input
            type="number" step="0.01" className="field" placeholder="Стара ціна"
            value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)}
          />
          <input
            type="number" className="field" placeholder="Залишок"
            value={form.stock} onChange={(e) => set("stock", e.target.value)}
          />
        </div>

        <div className="admin-form__row">
          <input className="field" placeholder="Бренд"
            value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          <input className="field" placeholder="Матеріал"
            value={form.material} onChange={(e) => set("material", e.target.value)} />
          <input className="field" placeholder="Колір"
            value={form.color} onChange={(e) => set("color", e.target.value)} />
        </div>

        <div className="admin-form__row">
          <input className="field" placeholder="Габарити"
            value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
          <input className="field" placeholder="Артикул"
            value={form.articleNumber} onChange={(e) => set("articleNumber", e.target.value)} />
          <label className="admin-form__check">
            <input type="checkbox" checked={form.isNew}
              onChange={(e) => set("isNew", e.target.checked)} />
            новинка
          </label>
        </div>

        <button type="submit" className="btn btn--primary">Створити товар</button>
        {error && <p className="admin-form__error">{error}</p>}
      </form>
    </details>
  );
};

export default ProductAdminForm;
