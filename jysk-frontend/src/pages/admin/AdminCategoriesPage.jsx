// src/pages/admin/AdminCategoriesPage.jsx
// Список категорій. Редагування — через наявний CategoryAdmin, поки
// не переїде сюди разом із рештою CRUD.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { asArray, errorMessage } from "../../api/axios";

const AdminCategoriesPage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/categories")
      .then(({ data }) => {
        if (!cancelled) setItems(asArray(data));
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="admin__section-head">
        <h2 className="admin__section-title">Категорії</h2>
        <span className="admin__count">Усього: {items.length}</span>
      </div>

      {error && <p className="admin__error">{error}</p>}
      {isLoading && <p className="admin__muted">Завантаження…</p>}

      {!isLoading && items.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Опис</th>
                <th>Товари</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td className="admin-table__mono">{c.id}</td>
                  <td>{c.name}</td>
                  <td className="admin-table__muted">{c.description || "—"}</td>
                  <td>
                    <Link to={`/catalog?categoryId=${c.id}`}>Переглянути</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminCategoriesPage;
