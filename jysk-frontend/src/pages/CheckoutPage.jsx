// src/pages/CheckoutPage.jsx
// Оформлення: адреса, коментар, підтвердження. POST /orders створює замовлення,
// списує залишки й повертає деталку — тільки після успіху чистимо кошик.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";
import useOrderStore from "../stores/orderStore";
import useAuthStore from "../stores/authStore";
import { formatPrice } from "../utils/format";
import "./ShopPages.css";

// Форма монтується вже з підставленою адресою (key прив'язаний до профілю),
// тому не доводиться синхронізувати стан у useEffect і затирати введене.
const CheckoutForm = ({ initialAddress, isLoading, onSubmit }) => {
  const [form, setForm] = useState({ deliveryAddress: initialAddress, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      deliveryAddress: form.deliveryAddress.trim(),
      comment: form.comment.trim() || null,
    });
  };

  return (
    <form className="shop__panel" onSubmit={handleSubmit}>
      <h2 className="shop__panel-title">Доставка</h2>
      <div className="shop__form">
        <label>
          Адреса доставки
          <input
            required
            className="field"
            placeholder="Місто, вулиця, будинок, квартира"
            maxLength={500}
            value={form.deliveryAddress}
            onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          />
        </label>
        <label>
          Коментар до замовлення
          <textarea
            className="field"
            rows="3"
            maxLength={500}
            placeholder="Наприклад: зателефонуйте за годину до доставки"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
        </label>
      </div>

      <div className="shop__actions">
        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? "Оформлюємо…" : "Підтвердити замовлення"}
        </button>
        <Link to="/cart" className="btn btn--outline">Назад до кошика</Link>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, toOrderItems, clear } = useCartStore();
  const { createOrder, isLoading, error } = useOrderStore();
  const { profile, fetchMe, isLoading: isProfileLoading } = useAuthStore();

  // Адресу підставляємо з профілю, щоб не набирати її вручну щоразу.
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async ({ deliveryAddress, comment }) => {
    const order = await createOrder({ deliveryAddress, comment, items: toOrderItems() });
    if (order) {
      clear();
      navigate(`/orders/${order.id}`, { replace: true });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container shop">
        <div className="shop__empty">
          <p>Кошик порожній — оформлювати нічого.</p>
          <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">Оформлення замовлення</h1>
        <p className="shop__sub">Перевірте склад замовлення та вкажіть адресу доставки</p>
      </header>

      {error && <p className="shop__error">{error}</p>}

      <div className="shop__layout">
        {!profile && isProfileLoading ? (
          <p className="shop__muted">Завантаження профілю…</p>
        ) : (
          <CheckoutForm
            key={profile?.id ?? "guest"}
            initialAddress={profile?.address ?? ""}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        )}

        <aside className="shop__panel shop__summary">
          <h2 className="shop__panel-title">Ваше замовлення</h2>
          {items.map((line) => (
            <div className="shop__summary-row" key={line.key}>
              <span>
                {line.name}
                {line.variantLabel ? ` · ${line.variantLabel}` : ""} × {line.quantity}
              </span>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </div>
          ))}
          <div className="shop__summary-row shop__summary-row--total">
            <span>До сплати</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="shop__muted" style={{ fontSize: "var(--fs-xs)", marginTop: "var(--space-3)" }}>
            Остаточну ціну підтверджує сервер за даними каталогу.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
