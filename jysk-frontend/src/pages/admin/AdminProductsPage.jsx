// src/pages/admin/AdminProductsPage.jsx
// Список товарів для адміністратора. Створення й редагування поки живуть
// у ProductAdminForm/ProductAdminPanel на публічних сторінках — сюди їх
// перенесемо, коли бекенд напарника закріпить контракт.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../../api/axios";
import { formatPrice } from "../../utils/format";

const PAGE_SIZE = 20;

const AdminProductsPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: { page, pageSize: PAGE_SIZE, sortBy: "newest" },
        });
        if (cancelled) return;
        setItems(data?.items ?? []);
        setTotal(data?.totalCount ?? 0);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="admin__section-head">
        <h2 className="admin__section-title">Товари</h2>
        <span className="admin__count">Усього: {total}</span>
      </div>

      {error && <p className="admin__error">{error}</p>}
      {isLoading && <p className="admin__muted">Завантаження…</p>}

      {!isLoading && items.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Артикул</th>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ціна</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="admin-table__mono">{p.articleNumber || "—"}</td>
                  <td>
                    <Link to={`/products/${p.id}`}>{p.name}</Link>
                  </td>
                  <td>{p.categoryName}</td>
                  <td>{formatPrice(p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin__pager">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Назад
          </button>
          <span>
            Сторінка {page} з {totalPages}
          </span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Далі
          </button>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
