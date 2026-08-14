// src/pages/CatalogPage.jsx
// Каталог / результати пошуку: фільтри + сітка + пагінація.
// Фільтри й номер сторінки синхронізовані з URL
// Усі запити — через методи сторів, не напряму axios.

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import useProductStore from "../stores/productStore";
import useCategoryStore from "../stores/categoryStore";
import useAuthStore from "../stores/authStore";
import ProductGrid from "../components/ProductGrid";
import { ChevronLeft, ChevronRight, FilterIcon, CloseIcon } from "../components/icons";
import ProductAdminForm from "../components/ProductAdminForm";
import "./CatalogPage.css";

const SORT_OPTIONS = [
  { value: "", label: "За замовчуванням" },
  { value: "price_asc", label: "Спочатку дешевші" },
  { value: "price_desc", label: "Спочатку дорожчі" },
  { value: "newest", label: "Новинки" },
  { value: "rating", label: "За рейтингом" },
];

const PAGE_SIZE = 12;

const CatalogPage = () => {
  const location = useLocation();
  const isSearch = location.pathname === "/search";
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, totalCount, page, totalPages, isLoading, error,
          fetchProducts, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const isAdmin = useAuthStore((s) => s.customer?.role === "Admin");

  // Локальні стани цінового діапазону (щоб не смикати URL на кожну цифру).
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  // На вузьких екранах колонка фільтрів займала цілий екран перед товарами,
  // тому там вона ховається за кнопку «Фільтр» і відкривається панеллю.
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const onSale = searchParams.get("onSale") === "1";
  const isNew = searchParams.get("isNew") === "1";
  const sortBy = searchParams.get("sort") ?? "";
  // Сторінка живе в URL, а не в локальному стані: інакше кнопка «Назад»
  // у браузері й посилання на другу сторінку каталогу не працювали.
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Один об'єкт параметрів на весь ефект: раніше в залежностях лежали і
  // searchParams, і виведені з нього значення — запит летів двічі на кожну зміну.
  const queryParams = useMemo(() => {
    const params = { page: currentPage, pageSize: PAGE_SIZE };
    if (search) params.search = search;
    if (categoryId) params.categoryId = Number(categoryId);
    if (onSale) params.onSale = true;
    if (isNew) params.isNew = true;
    if (sortBy) params.sortBy = sortBy;
    if (searchParams.get("minPrice")) params.minPrice = Number(searchParams.get("minPrice"));
    if (searchParams.get("maxPrice")) params.maxPrice = Number(searchParams.get("maxPrice"));
    return params;
  }, [search, categoryId, onSale, isNew, sortBy, currentPage, searchParams]);

  useEffect(() => {
    fetchProducts(queryParams);
  }, [queryParams, fetchProducts]);

  // Оновлення одного параметра URL (скидаючи порожні). Зміна фільтра завжди
  // повертає на першу сторінку.
  const patchParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v == null || v === false) next.delete(k);
      else next.set(k, v === true ? "1" : String(v));
    });
    if (!("page" in patch)) next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (nextPage) => patchParams({ page: nextPage > 1 ? nextPage : "" });

  const applyPrice = (e) => {
    e.preventDefault();
    patchParams({ minPrice, maxPrice });
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchParams(new URLSearchParams());
  };

  const handleDelete = async (id) => {
    if (window.confirm("Видалити товар?")) await deleteProduct(id);
  };

  const activeCategory = categories.find((c) => String(c.id) === categoryId);
  const heading = isSearch
    ? `Результати пошуку${search ? `: «${search}»` : ""}`
    : activeCategory
      ? activeCategory.name
      : onSale
        ? "Акції"
        : isNew
          ? "Новинки"
          : "Каталог товарів";

  return (
    <div className="container catalog">
      <header className="catalog__head">
        <h1 className="catalog__title">{heading}</h1>
        <p className="catalog__count">Знайдено товарів: {totalCount}</p>
      </header>

      {/* ─── Панель дій для вузьких екранів ─── */}
      <div className="catalog__mobile-bar">
        <button
          type="button"
          className="catalog__tool-btn"
          onClick={() => setFiltersOpen(true)}
        >
          <FilterIcon width={18} height={18} />
          Фільтр
        </button>

        <label className="catalog__tool-btn catalog__tool-btn--select">
          <span>Сортування</span>
          <select
            className="catalog__tool-select"
            value={sortBy}
            onChange={(e) => patchParams({ sort: e.target.value })}
            aria-label="Сортувати товари"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronRight width={16} height={16} className="catalog__tool-chevron" />
        </label>
      </div>

      <div className="catalog__layout">
        {/* ─── Фільтри ─── */}
        {filtersOpen && (
          <button
            type="button"
            className="catalog__overlay"
            aria-label="Закрити фільтри"
            onClick={() => setFiltersOpen(false)}
          />
        )}
        <aside
          className={"catalog__filters" + (filtersOpen ? " catalog__filters--open" : "")}
          aria-label="Фільтри"
        >
          <div className="filters">
            <div className="filters__head">
              <h2 className="filters__heading">Фільтри</h2>
              <button
                type="button"
                className="filters__close"
                aria-label="Закрити фільтри"
                onClick={() => setFiltersOpen(false)}
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>
            <div className="filters__group">
              <h2 className="filters__title">Категорії</h2>
              <ul className="filters__list">
                <li>
                  <button
                    type="button"
                    className={"filters__cat" + (!categoryId ? " filters__cat--active" : "")}
                    onClick={() => patchParams({ categoryId: "" })}
                  >
                    Усі категорії
                  </button>
                </li>
                {categories.filter((c) => !c.parentCategoryId).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={
                        "filters__cat" +
                        (String(c.id) === categoryId ? " filters__cat--active" : "")
                      }
                      onClick={() => patchParams({ categoryId: c.id })}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <form className="filters__group" onSubmit={applyPrice}>
              <h2 className="filters__title">Ціна, грн</h2>
              <div className="filters__price">
                <input
                  type="number" min="0" className="field" placeholder="від"
                  value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  aria-label="Ціна від"
                />
                <span className="filters__dash">—</span>
                <input
                  type="number" min="0" className="field" placeholder="до"
                  value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  aria-label="Ціна до"
                />
              </div>
              <button type="submit" className="btn btn--outline btn--block">Застосувати</button>
            </form>

            <div className="filters__group">
              <h2 className="filters__title">Позначки</h2>
              <label className="filters__check">
                <input
                  type="checkbox" checked={isNew}
                  onChange={(e) => patchParams({ isNew: e.target.checked })}
                />
                Тільки новинки
              </label>
              <label className="filters__check">
                <input
                  type="checkbox" checked={onSale}
                  onChange={(e) => patchParams({ onSale: e.target.checked })}
                />
                Зі знижкою
              </label>
            </div>

            <button type="button" className="filters__reset" onClick={resetFilters}>
              Скинути фільтри
            </button>

            {/* Видно лише у висувній панелі: фільтри вже застосовані,
                кнопка просто повертає до списку товарів. */}
            <button
              type="button"
              className="btn btn--primary btn--block filters__apply"
              onClick={() => setFiltersOpen(false)}
            >
              Показати товари ({totalCount})
            </button>
          </div>
        </aside>

        {/* ─── Результати ─── */}
        <div className="catalog__results">
          <div className="catalog__toolbar">
            <label className="catalog__sort">
              <span>Сортувати:</span>
              <select
                className="field"
                value={sortBy}
                onChange={(e) => patchParams({ sort: e.target.value })}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="catalog__error">Помилка: {error}</p>}
          {isLoading && <p className="catalog__loading">Завантаження товарів…</p>}

          {!isLoading && (
            <ProductGrid
              products={items}
              // Кнопку «Видалити» показуємо лише адміністратору: бекенд
              // усе одно віддасть 403, а покупцю вона просто заважала.
              onDelete={isAdmin ? handleDelete : undefined}
              empty="За вашим запитом нічого не знайдено."
            />
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Сторінки">
              <button
                type="button" className="pagination__btn"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                <ChevronLeft width={18} height={18} /> Назад
              </button>
              <span className="pagination__info">Сторінка {page} з {totalPages}</span>
              <button
                type="button" className="pagination__btn"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Далі <ChevronRight width={18} height={18} />
              </button>
            </nav>
          )}

          {isAdmin && <ProductAdminForm categories={categories} />}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
