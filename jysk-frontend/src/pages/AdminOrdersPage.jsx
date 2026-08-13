// src/pages/AdminOrdersPage.jsx
// Адмінський список замовлень: GET /orders/all + PATCH /orders/{id}/status.
// Маршрут закритий RequireAuth adminOnly, але вирішує все одно бекенд:
// обидві ручки вимагають роль Admin.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useOrderStore, { ORDER_STATUSES, STATUS_LABELS } from "../stores/orderStore";
import { formatPrice, formatDate } from "../utils/format";
import "./ShopPages.css";

const AdminOrdersPage = () => {
  const { adminOrders, adminTotal, isLoading, error, fetchAllOrders, updateStatus } = useOrderStore();
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAllOrders(status ? { status } : {});
  }, [status, fetchAllOrders]);

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">Замовлення магазину</h1>
        <p className="shop__sub">Усього: {adminTotal}</p>
      </header>

      {error && <p className="shop__error">{error}</p>}

      <div className="shop__panel">
        <label className="shop__form" style={{ maxWidth: 320, marginBottom: "var(--space-4)" }}>
          Статус
          <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Усі</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>

        {isLoading && <p className="shop__muted">Завантаження…</p>}

        {!isLoading && adminOrders.length === 0 && (
          <p className="shop__muted">Замовлень із таким статусом немає.</p>
        )}

        {adminOrders.length > 0 && (
          <div className="shop__scroll">
            <table className="shop__table">
              <thead>
                <tr>
                  <th>Замовлення</th>
                  <th>Покупець</th>
                  <th>Дата</th>
                  <th>Позицій</th>
                  <th>Сума</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.id}`}>{order.id.slice(0, 8).toUpperCase()}</Link>
                    </td>
                    <td>{order.customerName ?? "—"}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.itemCount}</td>
                    <td>{formatPrice(order.totalAmount)}</td>
                    <td>
                      <select
                        className="field"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        aria-label={`Статус замовлення ${order.id}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
