// src/pages/OrderDetailPage.jsx
// Деталі замовлення: GET /orders/{id}. Чуже замовлення бекенд віддає як 404,
// тому окремої перевірки прав тут не потрібно.

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useOrderStore, { STATUS_LABELS } from "../stores/orderStore";
import RemoteImage from "../components/RemoteImage";
import { formatPrice, formatDate } from "../utils/format";
import "./ShopPages.css";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { selectedOrder: order, isLoading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    fetchOrderById(id);
  }, [id, fetchOrderById]);

  if (isLoading && !order) return <p className="container shop shop__muted">Завантаження…</p>;
  if (error) return <p className="container shop shop__error">{error}</p>;
  if (!order) return null;

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">Замовлення № {order.id.slice(0, 8).toUpperCase()}</h1>
        <p className="shop__sub">
          Оформлено {formatDate(order.createdAt)} ·{" "}
          <span className={`status-chip status-chip--${order.status}`}>
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </p>
      </header>

      <div className="shop__layout">
        <ul className="shop__panel" style={{ listStyle: "none", margin: 0 }}>
          {order.items.map((item) => (
            <li className="cart-line" key={`${item.productId}-${item.variantLabel ?? ""}`}>
              <Link to={`/products/${item.productId}`} className="cart-line__media">
                <RemoteImage src={item.imageUrl} placeholderClassName="cart-line__placeholder" />
              </Link>
              <div>
                <h3 className="cart-line__name">
                  <Link to={`/products/${item.productId}`}>{item.productName}</Link>
                </h3>
                {item.variantLabel && <p className="cart-line__variant">{item.variantLabel}</p>}
                <p className="cart-line__variant">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="cart-line__price">{formatPrice(item.unitPrice * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <aside className="shop__panel shop__summary">
          <h2 className="shop__panel-title">Доставка</h2>
          <p className="shop__muted">{order.deliveryAddress}</p>
          {order.comment && (
            <p className="shop__muted" style={{ marginTop: "var(--space-3)" }}>
              Коментар: {order.comment}
            </p>
          )}
          <div className="shop__summary-row shop__summary-row--total">
            <span>Сума</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
          <div className="shop__actions">
            <Link to="/orders" className="btn btn--outline">До списку замовлень</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetailPage;
