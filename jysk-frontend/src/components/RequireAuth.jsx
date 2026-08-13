// src/components/RequireAuth.jsx
// Охрана маршрутов. Проверка на клиенте — это только UX: доступ к данным
// всё равно решает бэкенд по JWT, здесь мы просто не показываем гостю
// страницу, которая всё равно вернёт 401.

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const RequireAuth = ({ adminOnly = false }) => {
  const location = useLocation();
  const customer = useAuthStore((s) => s.customer);

  if (!customer) {
    // state.from — чтобы после входа вернуть человека туда, куда он шёл.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && customer.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
