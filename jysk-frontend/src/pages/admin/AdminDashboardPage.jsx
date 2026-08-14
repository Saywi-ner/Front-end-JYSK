// src/pages/admin/AdminDashboardPage.jsx
// Огляд: кілька лічильників з тих ендпоінтів, що вже існують.
// Показники, під які бекенду ще немає (виручка, конверсія), свідомо
// не вигадуємо — краще порожня плитка з поясненням, ніж фальшиве число.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { asArray } from "../../api/axios";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ products: null, categories: null, orders: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Список товарів повертає totalCount, тож вистачить однієї позиції.
        const [products, categories, orders] = await Promise.all([
          api.get("/products", { params: { pageSize: 1 } }),
          api.get("/categories"),
          api.get("/orders/all").catch(() => null),
        ]);

        if (cancelled) return;
        setStats({
          products: products.data?.totalCount ?? null,
          categories: asArray(categories.data).length,
          orders: orders ? asArray(orders.data).length : null,
        });
      } catch {
        if (!cancelled) setError("Не вдалося завантажити показники");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const tiles = [
    { label: "Товарів у каталозі", value: stats.products, to: "/admin/products" },
    { label: "Категорій", value: stats.categories, to: "/admin/categories" },
    { label: "Замовлень", value: stats.orders, to: "/admin/orders" },
  ];

  return (
    <>
      <h2 className="admin__section-title">Огляд</h2>
      {error && <p className="admin__error">{error}</p>}

      <ul className="admin-tiles">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link to={t.to} className="admin-tile">
              <span className="admin-tile__value">{t.value ?? "—"}</span>
              <span className="admin-tile__label">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="admin__note">
        <h3 className="admin__note-title">Що з’явиться далі</h3>
        <p>
          Виручка, статуси доставки та звіти чекають на відповідні ендпоінти.
          Коли вони будуть — плитки додаються сюди, решта каркаса вже готова.
        </p>
      </div>
    </>
  );
};

export default AdminDashboardPage;
