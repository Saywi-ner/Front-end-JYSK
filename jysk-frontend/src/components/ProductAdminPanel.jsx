// src/components/ProductAdminPanel.jsx
// Адмінська панель на сторінці товару: редагування/видалення товара
// та керування варіантами. Схована у <details>.
//   PUT/DELETE /products/{id}
//   POST/DELETE /products/{id}/variants

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../stores/productStore";
import useVariantStore from "../stores/variantStore";
import { formatPrice } from "../utils/format";
import "./ProductAdminPanel.css";

const ProductAdminPanel = ({ product, categories, variants }) => {
  const navigate = useNavigate();
  const { updateProduct, deleteProduct } = useProductStore();
  const { addVariant, deleteVariant } = useVariantStore();

  const [editForm, setEditForm] = useState(null);
  const [newVariant, setNewVariant] = useState({ label: "", color: "", size: "", price: "", stock: "" });

  const openEdit = () =>
    setEditForm({
      name: product.name, description: product.description ?? "", price: product.price,
      oldPrice: product.oldPrice ?? "", stock: product.stock, brand: product.brand ?? "",
      material: product.material ?? "", color: product.color ?? "", dimensions: product.dimensions ?? "",
      articleNumber: product.articleNumber ?? "", isNew: product.isNew, categoryId: product.categoryId,
    });

  const setE = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    const ok = await updateProduct(product.id, {
      ...editForm,
      price: Number(editForm.price),
      oldPrice: editForm.oldPrice ? Number(editForm.oldPrice) : null,
      stock: Number(editForm.stock),
      categoryId: Number(editForm.categoryId),
    });
    if (ok) setEditForm(null);
  };

  const handleDelete = async () => {
    if (!window.confirm("Видалити товар цілком?")) return;
    const ok = await deleteProduct(product.id);
    if (ok) navigate("/catalog");
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    const ok = await addVariant(product.id, {
      label: newVariant.label, color: newVariant.color, size: newVariant.size,
      price: Number(newVariant.price), stock: Number(newVariant.stock || 0),
    });
    if (ok) setNewVariant({ label: "", color: "", size: "", price: "", stock: "" });
  };

  return (
    <details className="admin-panel">
      <summary className="admin-panel__summary">⚙ Керування товаром (адмін)</summary>

      <div className="admin-panel__body">
        {/* дії */}
        <div className="admin-panel__actions">
          <button
            type="button" className="btn btn--outline"
            onClick={editForm ? () => setEditForm(null) : openEdit}
          >
            {editForm ? "Скасувати редагування" : "✏️ Редагувати товар"}
          </button>
          <button type="button" className="btn btn--outline admin-panel__danger" onClick={handleDelete}>
            🗑 Видалити товар
          </button>
        </div>

        {/* форма редагування */}
        {editForm && (
          <form className="admin-panel__form" onSubmit={handleUpdate}>
            <input required className="field" placeholder="Назва" value={editForm.name}
              onChange={(e) => setE("name", e.target.value)} />
            <textarea className="field" rows="2" placeholder="Опис" value={editForm.description}
              onChange={(e) => setE("description", e.target.value)} />
            <div className="admin-panel__row">
              <input required type="number" step="0.01" className="field" placeholder="Ціна"
                value={editForm.price} onChange={(e) => setE("price", e.target.value)} />
              <input type="number" step="0.01" className="field" placeholder="Стара ціна"
                value={editForm.oldPrice} onChange={(e) => setE("oldPrice", e.target.value)} />
              <input type="number" className="field" placeholder="Залишок"
                value={editForm.stock} onChange={(e) => setE("stock", e.target.value)} />
            </div>
            <div className="admin-panel__row">
              <input className="field" placeholder="Бренд" value={editForm.brand}
                onChange={(e) => setE("brand", e.target.value)} />
              <input className="field" placeholder="Матеріал" value={editForm.material}
                onChange={(e) => setE("material", e.target.value)} />
              <input className="field" placeholder="Колір" value={editForm.color}
                onChange={(e) => setE("color", e.target.value)} />
            </div>
            <div className="admin-panel__row">
              <input className="field" placeholder="Габарити" value={editForm.dimensions}
                onChange={(e) => setE("dimensions", e.target.value)} />
              <input className="field" placeholder="Артикул" value={editForm.articleNumber}
                onChange={(e) => setE("articleNumber", e.target.value)} />
              <select required className="field" value={editForm.categoryId}
                onChange={(e) => setE("categoryId", e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <label className="admin-panel__check">
              <input type="checkbox" checked={editForm.isNew}
                onChange={(e) => setE("isNew", e.target.checked)} />
              новинка
            </label>
            <button type="submit" className="btn btn--primary">Зберегти зміни</button>
          </form>
        )}

        {/* варіанти */}
        <div className="admin-panel__variants">
          <h3 className="admin-panel__subtitle">Варіанти</h3>
          {variants.length > 0 ? (
            <ul className="admin-panel__var-list">
              {variants.map((v) => (
                <li key={v.id} className="admin-panel__var">
                  <span>{v.label || [v.size, v.color].filter(Boolean).join(" · ")} — {formatPrice(v.price)} (залишок: {v.stock})</span>
                  <button type="button" onClick={() => deleteVariant(product.id, v.id)}>видалити</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-panel__muted">Варіантів немає.</p>
          )}

          <form className="admin-panel__var-form" onSubmit={handleAddVariant}>
            <input required className="field" placeholder="Мітка (160×200, Білий)"
              value={newVariant.label} onChange={(e) => setNewVariant({ ...newVariant, label: e.target.value })} />
            <input className="field" placeholder="Колір"
              value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} />
            <input className="field" placeholder="Розмір"
              value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })} />
            <input required type="number" step="0.01" className="field" placeholder="Ціна"
              value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />
            <input type="number" className="field" placeholder="Залишок"
              value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })} />
            <button type="submit" className="btn btn--primary">Додати варіант</button>
          </form>
        </div>
      </div>
    </details>
  );
};

export default ProductAdminPanel;
