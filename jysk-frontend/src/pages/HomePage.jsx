// src/pages/HomePage.jsx
// Головна за макетом TALO: hero, пошук по кімнатах, блоки товарів
// (новинки / завжди низька ціна / чудові пропозиції) та банери акцій.
//   GET /products/homepage -> { newArrivals, onSale, recommended }
//   GET /rooms             -> картки в «Пошук по кімнатах»
//   GET /categories        -> запасний варіант, поки кімнати не заведені

import { useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../stores/productStore";
import useCategoryStore from "../stores/categoryStore";
import { useRoomStore } from "../stores/showcaseStore";
import SectionHeader from "../components/SectionHeader";
import ProductCarousel from "../components/ProductCarousel";
import RemoteImage from "../components/RemoteImage";
import { ChevronRight } from "../components/icons";
import heroImage from "../assets/hero.png";
import "./HomePage.css";

// Банери блоку «Акції». Це редакційний контент, а не дані з API,
// тож тримаємо його поруч зі сторінкою, яка його показує.
const PROMOS = [
  {
    id: "family",
    eyebrow: "Family Days",
    title: "Святкуємо разом найщиріше",
    text: "До −50 % на товари для дому та затишку",
    cta: "До акцій",
    to: "/catalog?onSale=1",
    image:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80",
    tone: "warm",
  },
  {
    id: "garden",
    eyebrow: "−20%",
    title: "На все для саду та відпочинку",
    text: "Меблі, текстиль та декор для тераси",
    cta: "До акцій",
    // Раніше тут стояв ?categoryName=… — бекенд такого фільтра не має,
    // тож посилання мовчки відкривало весь каталог.
    to: "/catalog?isNew=1",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    tone: "green",
  },
  {
    id: "textile",
    eyebrow: "−20%",
    title: "На текстиль та декор",
    text: "Подушки, пледи й дрібниці для настрою",
    cta: "До акцій",
    to: "/catalog?onSale=1",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
    tone: "sand",
  },
];

const HomePage = () => {
  const { homepage, isHomeLoading, fetchHomepage } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { items: roomItems, fetchAll: fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchHomepage();
    fetchCategories();
    fetchRooms();
  }, [fetchHomepage, fetchCategories, fetchRooms]);

  // Кімнати — окремий ресурс, але поки їх не завели, показуємо кореневі
  // категорії: порожній блок на головній виглядав би як помилка.
  const rooms =
    roomItems.length > 0
      ? roomItems.slice(0, 8).map((r) => ({ id: r.id, name: r.name, imageUrl: r.coverImageUrl, to: `/rooms/${r.id}` }))
      : categories
          .filter((c) => !c.parentCategoryId)
          .slice(0, 8)
          .map((c) => ({ id: c.id, name: c.name, imageUrl: c.imageUrl, to: `/catalog?categoryId=${c.id}` }));

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
          <div className="hero__media">
            <img src={heroImage} alt="" loading="eager" />
          </div>
        </div>
      </section>

      {/* ─── Пошук по кімнатах ─── */}
      {rooms.length > 0 && (
        <section className="container section">
          <SectionHeader title="Пошук по кімнатах" linkTo="/rooms" withDots={false} />
          <ul className="rooms">
            {rooms.map((c) => (
              <li key={c.id} className="rooms__item">
                <Link to={c.to} className="room">
                  <span className="room__media">
                    <RemoteImage
                      src={c.imageUrl}
                      placeholderClassName="room__initial"
                      placeholder={c.name.charAt(0)}
                    />
                  </span>
                  <span className="room__name">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Блоки товарів ─── */}
      {isHomeLoading && <p className="container home__loading">Завантаження…</p>}

      {homepage?.newArrivals?.length > 0 && (
        <section className="container section">
          <SectionHeader title="Новинки" linkTo="/catalog?isNew=1" />
          <ProductCarousel products={homepage.newArrivals} />
        </section>
      )}

      {homepage?.onSale?.length > 0 && (
        <section className="container section">
          <SectionHeader title="Завжди низька ціна" linkTo="/catalog?onSale=1" />
          <ProductCarousel products={homepage.onSale} />
        </section>
      )}

      {/* ─── Акції ─── */}
      <section className="container section">
        <SectionHeader title="Акції" linkTo="/catalog?onSale=1" withDots={false} />
        <ul className="promos">
          {PROMOS.map((p) => (
            <li key={p.id} className={`promo promo--${p.tone}`}>
              <RemoteImage className="promo__image" src={p.image} />
              <div className="promo__content">
                <p className="promo__eyebrow">{p.eyebrow}</p>
                <h3 className="promo__title">{p.title}</h3>
                <p className="promo__text">{p.text}</p>
                <Link to={p.to} className="promo__cta">
                  {p.cta} <ChevronRight width={16} height={16} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {homepage?.recommended?.length > 0 && (
        <section className="container section">
          <SectionHeader title="Чудові пропозиції" linkTo="/catalog" />
          <ProductCarousel products={homepage.recommended} />
        </section>
      )}
    </div>
  );
};

export default HomePage;
