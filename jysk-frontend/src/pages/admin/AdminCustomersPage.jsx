// src/pages/admin/AdminCustomersPage.jsx
// Клієнти: GET /customers (тільки для ролі Admin).
//
// Якщо ендпоінт ще не піднятий на бекенді, показуємо це прямо, а не
// порожню таблицю: інакше незрозуміло, чи клієнтів немає, чи щось зламалось.

import { useEffect, useState } from "react";
import api, { asArray, errorMessage } from "../../api/axios";
import { formatDate } from "../../utils/format";

const AdminCustomersPage = () => {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | missing | error
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/customers")
      .then(({ data }) => {
        if (cancelled) return;
        setItems(asArray(data));
        setState("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        if (e?.response?.status === 404) {
          setState("missing");
        } else {
          setError(errorMessage(e));
          setState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="admin__section-head">
        <h2 className="admin__section-title">Клієнти</h2>
        {state === "ready" && <span className="admin__count">Усього: {items.length}</span>}
      </div>

      {state === "loading" && <p className="admin__muted">Завантаження…</p>}
      {state === "error" && <p className="admin__error">{error}</p>}

      {state === "missing" && (
        <div className="admin__note">
          <h3 className="admin__note-title">Ендпоінт ще не готовий</h3>
          <p>
            Розділ чекає на <code>GET /customers</code>. Щойно він з’явиться,
            таблиця нижче почне наповнюватись без інших правок.
          </p>
        </div>
      )}

      {state === "ready" && items.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ім’я</th>
                <th>Пошта</th>
                <th>Роль</th>
                <th>Зареєстровано</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{[c.firstName, c.lastName].filter(Boolean).join(" ")}</td>
                  <td className="admin-table__mono">{c.email}</td>
                  <td>{c.role}</td>
                  <td className="admin-table__muted">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminCustomersPage;
