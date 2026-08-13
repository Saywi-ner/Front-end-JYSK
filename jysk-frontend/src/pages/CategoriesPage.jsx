// src/pages/CategoriesPage.jsx
// Категорії: сітка карток-категорій + адмінський CRUD (схований у <details>).

import { useEffect } from "react";
import { Link } from "react-router-dom";
import useCategoryStore from "../stores/categoryStore";
import useAuthStore from "../stores/authStore";
import CategoryAdmin from "../components/CategoryAdmin";
import { ChevronRight } from "../components/icons";
import "./CategoriesPage.css";

const CategoriesPage = () => {
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  const isAdmin = useAuthStore((s) => s.customer?.role === "Admin");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const topLevel = categories.filter((c) => !c.parentCategoryId);
  const childrenOf = (id) => categories.filter((c) => c.parentCategoryId === id);

  return (
    <div className="container categories">
      <header className="categories__head">
        <h1 className="categories__title">Категорії товарів</h1>
        <p className="categories__sub">Оберіть розділ, щоб переглянути товари</p>
      </header>

      {error && <p className="categories__error">Помилка: {error}</p>}
      {isLoading && <p className="categories__loading">Завантаження…</p>}

      <ul className="categories__grid">
        {topLevel.map((c) => {
          const subs = childrenOf(c.id);
          return (
            <li key={c.id} className="cat-card">
              <Link to={`/catalog?categoryId=${c.id}`} className="cat-card__media">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} loading="lazy" />
                ) : (
                  <span className="cat-card__placeholder">{c.name.charAt(0)}</span>
                )}
              </Link>
              <div className="cat-card__body">
                <h2 className="cat-card__name">
                  <Link to={`/catalog?categoryId=${c.id}`}>{c.name}</Link>
                </h2>
                {c.description && <p className="cat-card__desc">{c.description}</p>}

                {subs.length > 0 && (
                  <ul className="cat-card__subs">
                    {subs.slice(0, 5).map((s) => (
                      <li key={s.id}>
                        <Link to={`/catalog?categoryId=${s.id}`} className="cat-card__sub">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <Link to={`/catalog?categoryId=${c.id}`} className="cat-card__link">
                  Дивитись товари <ChevronRight width={16} height={16} />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {!isLoading && topLevel.length === 0 && (
        <p className="categories__empty">Категорій ще немає.</p>
      )}

      {/* CRUD категорій — лише для адміністратора; бекенд усе одно віддасть 403. */}
      {isAdmin && <CategoryAdmin categories={categories} />}
    </div>
  );
};

export default CategoriesPage;
