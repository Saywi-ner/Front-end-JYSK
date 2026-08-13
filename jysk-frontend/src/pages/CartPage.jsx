// src/pages/CartPage.jsx
// Кошик: список позицій, кількість, підсумок. Дані локальні (cartStore),
// на сервер вони йдуть лише під час оформлення — POST /orders.

import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";
import RemoteImage from "../components/RemoteImage";
import { formatPrice } from "../utils/format";
import "./ShopPages.css";

const CartLine = ({ line }) => {
  const { setQuantity, remove } = useCartStore();

  return (
    <li className="cart-line">
      <Link to={`/products/${line.productId}`} className="cart-line__media">
        <RemoteImage src={line.imageUrl} placeholderClassName="cart-line__placeholder" />
      </Link>

      <div>
        <h3 className="cart-line__name">
          <Link to={`/products/${line.productId}`}>{line.name}</Link>
        </h3>
        {line.variantLabel && <p className="cart-line__variant">{line.variantLabel}</p>}
        <p className="cart-line__price">{formatPrice(line.price)}</p>

        <div className="cart-line__controls">
          <div className="cart-line__qty">
            <button
              type="button"
              aria-label="Зменшити кількість"
              disabled={line.quantity <= 1}
              onClick={() => setQuantity(line.key, line.quantity - 1)}
            >
              −
            </button>
            <output aria-label="Кількість">{line.quantity}</output>
            <button
              type="button"
              aria-label="Збільшити кількість"
              onClick={() => setQuantity(line.key, line.quantity + 1)}
            >
              +
            </button>
          </div>

          <button type="button" className="cart-line__remove" onClick={() => remove(line.key)}>
            Прибрати
          </button>
        </div>
      </div>

      <p className="cart-line__price">{formatPrice(line.price * line.quantity)}</p>
    </li>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { items, clear } = useCartStore();
  const customer = useAuthStore((s) => s.customer);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  // Гостя ведемо на вхід, але з наміром повернутись до оформлення.
  const goToCheckout = () =>
    navigate(customer ? "/checkout" : "/login", customer ? undefined : { state: { from: { pathname: "/checkout" } } });

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">Кошик</h1>
        <p className="shop__sub">
          {count > 0 ? `Товарів у кошику: ${count}` : "Поки що порожньо"}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="shop__empty">
          <p>У кошику ще немає товарів.</p>
          <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
        </div>
      ) : (
        <div className="shop__layout">
          <ul className="shop__panel" style={{ listStyle: "none", margin: 0 }}>
            {items.map((line) => (
              <CartLine key={line.key} line={line} />
            ))}
          </ul>

          <aside className="shop__panel shop__summary">
            <h2 className="shop__panel-title">Разом</h2>
            <div className="shop__summary-row">
              <span>Товари ({count})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="shop__summary-row">
              <span>Доставка</span>
              <span>{total >= 2000 ? "Безкоштовно" : "За тарифом"}</span>
            </div>
            <div className="shop__summary-row shop__summary-row--total">
              <span>До сплати</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="shop__actions">
              <button type="button" className="btn btn--primary btn--block" onClick={goToCheckout}>
                Оформити замовлення
              </button>
              <button type="button" className="cart-line__remove" onClick={clear}>
                Очистити кошик
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
