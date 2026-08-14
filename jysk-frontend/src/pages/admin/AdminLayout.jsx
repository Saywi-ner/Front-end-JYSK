// src/pages/admin/AdminLayout.jsx
// Каркас адмінки: бічне меню розділів і область вмісту.
//
// Доступ уже обмежений RequireAuth adminOnly у маршрутах — тут лише
// оформлення. Розділи, під які бекенду ще немає, показують заглушку
// замість того, щоб мовчки падати на 404.

import { NavLink, Outlet } from "react-router-dom";
import "./Admin.css";

const SECTIONS = [
  { to: "/admin", label: "Огляд", end: true },
  { to: "/admin/products", label: "Товари" },
  { to: "/admin/categories", label: "Категорії" },
  { to: "/admin/orders", label: "Замовлення" },
  { to: "/admin/customers", label: "Клієнти" },
];

const AdminLayout = () => (
  <div className="container admin">
    <header className="admin__head">
      <h1 className="admin__title">Панель адміністратора</h1>
      <p className="admin__subtitle">Керування каталогом, замовленнями та клієнтами</p>
    </header>

    <div className="admin__layout">
      <nav className="admin__nav" aria-label="Розділи адмінки">
        {SECTIONS.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            end={s.end}
            className={({ isActive }) =>
              "admin__nav-link" + (isActive ? " admin__nav-link--active" : "")
            }
          >
            {s.label}
          </NavLink>
        ))}
      </nav>

      <section className="admin__content">
        <Outlet />
      </section>
    </div>
  </div>
);

export default AdminLayout;
