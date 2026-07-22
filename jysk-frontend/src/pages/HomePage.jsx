// src/pages/HomePage.jsx
// Головна: hero-банер, категорії, блоки товарів (новинки / акції / рекомендовані).
//   GET /products/homepage -> { newArrivals, onSale, recommended }
//   GET /categories        -> для рядка категорій

import { useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../stores/productStore";
import useCategoryStore from "../stores/categoryStore";
import SectionHeader from "../components/SectionHeader";
import ProductGrid from "../components/ProductGrid";
import { ChevronRight } from "../components/icons";
import "./HomePage.css";

const HomePage = () => {
  const { homepage, isHomeLoading, fetchHomepage } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchHomepage();
    fetchCategories();
  }, [fetchHomepage, fetchCategories]);

  const topCategories = categories.filter((c) => !c.parentCategoryId).slice(0, 8);

  return (
    <div className="home">
      {/* ─── Hero ─── */}
      <section className="container">
        <div className="hero">
          <div className="hero__content">
            <p className="hero__eyebrow">TALO — товари для дому</p>
            <h1 className="hero__title">Просто для життя, затишку та злагоди</h1>
            <p className="hero__text">
              Меблі й декор, що роблять дім теплішим. Обирайте перевірені речі
              за чесними цінами.
            </p>
            <div className="hero__actions">
              <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
              <Link to="/catalog?onSale=1" className="btn btn--outline">Акції тижня</Link>
            </div>
          </div>
          <div className="hero__media" aria-hidden="true">
            <span className="hero__media-label">TALO</span>
          </div>
        </div>
      </section>

      {/* ─── Категорії ─── */}
      {topCategories.length > 0 && (
        <section className="container section">
          <SectionHeader title="Категорії" linkTo="/categories" />
          <ul className="home-cats">
            {topCategories.map((c) => (
              <li key={c.id}>
                <Link to={`/catalog?categoryId=${c.id}`} className="home-cat">
                  <span className="home-cat__circle">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt="" loading="lazy" />
                    ) : (
                      <span className="home-cat__initial">{c.name.charAt(0)}</span>
                    )}
                  </span>
                  <span className="home-cat__name">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Промо-банер ─── */}
      <section className="container section">
        <div className="home-promo">
          <div className="home-promo__text">
            <h2 className="home-promo__title">Знижки до −40% на сезонні товари</h2>
            <p className="home-promo__sub">Оновіть інтер'єр вигідно — акції діють обмежений час.</p>
          </div>
          <Link to="/catalog?onSale=1" className="btn btn--accent">
            Перейти до акцій <ChevronRight width={18} height={18} />
          </Link>
        </div>
      </section>

      {/* ─── Блоки товарів ─── */}
      {isHomeLoading && <p className="container home__loading">Завантаження…</p>}

      {homepage?.newArrivals?.length > 0 && (
        <section className="container section">
          <SectionHeader title="Новинки" linkTo="/catalog?isNew=1" />
          <ProductGrid products={homepage.newArrivals} />
        </section>
      )}

      {homepage?.onSale?.length > 0 && (
        <section className="container section">
          <SectionHeader title="Акції" linkTo="/catalog?onSale=1" />
          <ProductGrid products={homepage.onSale} />
        </section>
      )}

      {homepage?.recommended?.length > 0 && (
        <section className="container section">
          <SectionHeader title="Вам може сподобатись" linkTo="/catalog" />
          <ProductGrid products={homepage.recommended} />
        </section>
      )}
    </div>
  );
};

export default HomePage;
