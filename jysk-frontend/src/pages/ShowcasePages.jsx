// src/pages/ShowcasePages.jsx
// Кімнати (/rooms) та колекції (/collections). Обидва розділи влаштовані
// однаково — список карток і сторінка з товарами, — тому сторінки збираються
// з двох спільних компонентів, а не дублюються чотири рази.
//
//   GET /rooms | /collections           -> [{ id, name, description, coverImageUrl }]
//   GET /rooms/{id} | /collections/{id} -> + products[{ id, name, price, mainImageUrl }]

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoomStore, useCollectionStore } from "../stores/showcaseStore";
import ProductGrid from "../components/ProductGrid";
import RemoteImage from "../components/RemoteImage";
import { ChevronRight } from "../components/icons";
import "./ShopPages.css";

const ShowcaseList = ({ store, basePath, title, subtitle, emptyText }) => {
  const { items, isLoading, error, fetchAll } = store();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">{title}</h1>
        <p className="shop__sub">{subtitle}</p>
      </header>

      {error && <p className="shop__error">{error}</p>}
      {isLoading && <p className="shop__muted">Завантаження…</p>}

      {!isLoading && items.length === 0 && <p className="shop__muted">{emptyText}</p>}

      <ul className="showcase-grid">
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`${basePath}/${item.id}`} className="showcase-card">
              <span className="showcase-card__media">
                <RemoteImage src={item.coverImageUrl} placeholderClassName="cart-line__placeholder" />
              </span>
              <span className="showcase-card__body">
                <span className="showcase-card__name">{item.name}</span>
                {item.description && <span className="showcase-card__desc">{item.description}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ShowcaseDetail = ({ store, basePath, backLabel }) => {
  const { id } = useParams();
  const { selected, isLoading, error, fetchById } = store();

  useEffect(() => {
    fetchById(id);
  }, [id, fetchById]);

  if (isLoading && !selected) return <p className="container shop shop__muted">Завантаження…</p>;
  if (error) return <p className="container shop shop__error">{error}</p>;
  if (!selected) return null;

  return (
    <div className="container shop">
      <nav className="detail__breadcrumbs" aria-label="Навігація">
        <Link to="/">Головна</Link>
        <ChevronRight width={14} height={14} />
        <Link to={basePath}>{backLabel}</Link>
        <ChevronRight width={14} height={14} />
        <span>{selected.name}</span>
      </nav>

      <header className="shop__head">
        <h1 className="shop__title">{selected.name}</h1>
        {selected.description && <p className="shop__sub">{selected.description}</p>}
      </header>

      {/* Вітрина віддає скорочену картку (без рейтингу й опису) —
          ProductGrid рендерить її тими самими компонентами, просто
          порожні поля не показуються. */}
      <ProductGrid products={selected.products} empty="У цьому розділі ще немає товарів." />
    </div>
  );
};

export const RoomsPage = () => (
  <ShowcaseList
    store={useRoomStore}
    basePath="/rooms"
    title="Кімнати"
    subtitle="Готові добірки меблів і декору для кожної кімнати"
    emptyText="Кімнат поки немає."
  />
);

export const RoomDetailPage = () => (
  <ShowcaseDetail store={useRoomStore} basePath="/rooms" backLabel="Кімнати" />
);

export const CollectionsPage = () => (
  <ShowcaseList
    store={useCollectionStore}
    basePath="/collections"
    title="Колекції"
    subtitle="Добірки за стилем: скандинавський, мінімалізм та інші"
    emptyText="Колекцій поки немає."
  />
);

export const CollectionDetailPage = () => (
  <ShowcaseDetail store={useCollectionStore} basePath="/collections" backLabel="Колекції" />
);
