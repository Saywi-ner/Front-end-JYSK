// src/components/ProductCarousel.jsx
// Горизонтальна стрічка карток зі стрілками — як блоки товарів у макеті.
//
// Прокрутка нативна (overflow-x + scroll-snap), тому на тачскріні секція
// гортається пальцем без JS, а стрілки лишаються для миші. Кнопки ховаються,
// коли гортати нікуди — інакше вони збивають з пантелику.

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "./icons";
import "./ProductCarousel.css";

const ProductCarousel = ({ products, onAddToCart, onToggleWish }) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    // 1px допуск: браузери округлюють scrollLeft на дробних масштабах.
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncEdges, products]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".product-carousel__item");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="product-carousel">
      <button
        type="button"
        className="product-carousel__nav product-carousel__nav--prev"
        aria-label="Попередні товари"
        hidden={atStart}
        onClick={() => scrollByCard(-1)}
      >
        <ChevronLeft width={20} height={20} />
      </button>

      <ul className="product-carousel__track" ref={trackRef} onScroll={syncEdges}>
        {products.map((p) => (
          <li className="product-carousel__item" key={p.id}>
            <ProductCard
              product={p}
              onAddToCart={onAddToCart}
              onToggleWish={onToggleWish}
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="product-carousel__nav product-carousel__nav--next"
        aria-label="Наступні товари"
        hidden={atEnd}
        onClick={() => scrollByCard(1)}
      >
        <ChevronRight width={20} height={20} />
      </button>
    </div>
  );
};

export default ProductCarousel;
