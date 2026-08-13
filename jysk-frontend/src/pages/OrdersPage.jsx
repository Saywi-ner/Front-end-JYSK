// src/pages/OrdersPage.jsx
// Мої замовлення: GET /orders (лише свої, фільтрує бекенд за токеном).

import { useEffect } from "react";
import { Link } from "react-router-dom";
import useOrderStore, { STATUS_LABELS } from "../stores/orderStore";
import { formatPrice, formatDate } from "../utils/format";
import "./ShopPages.css";

const OrdersPage = () => {
  const { orders, isLoading, error, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">Мої замовлення</h1>
        <p className="shop__sub">Історія покупок та статуси доставки</p>
      </header>

      {error && <p className="shop__error">{error}</p>}
      {isLoading && <p className="shop__muted">Завантаження…</p>}

      {!isLoading && orders.length === 0 && (
        <div className="shop__empty">
          <p>Замовлень поки немає.</p>
          <Link to="/catalog" className="btn btn--primary">Перейти до каталогу</Link>
        </div>
      )}

      {orders.map((order) => (
        <article className="order-row" key={order.id}>
          <div>
            <p className="order-row__id">Замовлення № {order.id.slice(0, 8).toUpperCase()}</p>
            <p className="order-row__meta">
              {formatDate(order.createdAt)} · позицій: {order.itemCount} · {order.deliveryAddress}
            </p>
          </div>
          <div className="order-row__side">
            <span className={`status-chip status-chip--${order.status}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
            <strong>{formatPrice(order.totalAmount)}</strong>
            <Link to={`/orders/${order.id}`} className="btn btn--outline">Деталі</Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default OrdersPage;
