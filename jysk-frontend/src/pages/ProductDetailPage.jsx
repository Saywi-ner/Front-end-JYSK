// src/pages/ProductDetailPage.jsx
// Картка товару: галерея + інфо + варіанти + вкладки + відгуки + схожі товари.
//   GET /products/:id -> { ..., images[], variants[], avgRating, reviewCount, relatedProducts[] }
//   варіанти/відгуки — через свої сторы. Адмінські дії — у ProductAdminPanel.

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useProductStore from "../stores/productStore";
import useVariantStore from "../stores/variantStore";
import useReviewStore from "../stores/reviewStore";
import useAuthStore from "../stores/authStore";
import useCategoryStore from "../stores/categoryStore";
import ProductGallery from "../components/ProductGallery";
import VariantSelector from "../components/VariantSelector";
import RatingStars from "../components/RatingStars";
import ProductGrid from "../components/ProductGrid";
import SectionHeader from "../components/SectionHeader";
import ProductAdminPanel from "../components/ProductAdminPanel";
import { CartIcon, ChevronRight } from "../components/icons";
import { formatPrice, discountPercent } from "../utils/format";
import "./ProductDetailPage.css";

// Обгортка: key={id} перемонтовує в'ю при зміні товару — локальний стан
// (обраний варіант, вкладка) скидається природно, без setState в ефекті.
const ProductDetailPage = () => {
  const { id } = useParams();
  return <ProductDetailView key={id} id={id} />;
};

const ProductDetailView = ({ id }) => {
  const { selectedProduct: p, isLoading, error, fetchProductById } = useProductStore();
  const { variants, fetchVariants } = useVariantStore();
  const { reviews, fetchReviews, addReview, error: reviewError } = useReviewStore();
  const { customer } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [tab, setTab] = useState("description");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchProductById(id);
    fetchVariants(id);
    fetchReviews(id);
    fetchCategories();
    window.scrollTo({ top: 0 });
  }, [id, fetchProductById, fetchVariants, fetchReviews, fetchCategories]);

  if (isLoading && !p) return <p className="container detail__state">Завантаження товару…</p>;
  if (error) return <p className="container detail__state">Помилка: {error}</p>;
  if (!p) return null;

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant ? selectedVariant.price : p.price;
  const discount = discountPercent(p.price, p.oldPrice);
  const inStock = (selectedVariant ? selectedVariant.stock : p.stock) > 0;

  const specs = [
    ["Артикул", p.articleNumber],
    ["Бренд", p.brand],
    ["Колір", p.color],
    ["Матеріал", p.material],
    ["Габарити", p.dimensions],
    ["Категорія", p.categoryName],
  ].filter(([, v]) => v);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const ok = await addReview(p.id, Number(newReview.rating), newReview.comment, customer.id);
    if (ok) {
      setNewReview({ rating: 5, comment: "" });
      fetchProductById(p.id); // оновити avgRating/reviewCount
    }
  };

  return (
    <div className="container detail">
      {/* ─── Хлібні крихти ─── */}
      <nav className="detail__breadcrumbs" aria-label="Навігація">
        <Link to="/">Головна</Link>
        <ChevronRight width={14} height={14} />
        <Link to="/catalog">Каталог</Link>
        {p.categoryName && (
          <>
            <ChevronRight width={14} height={14} />
            <Link to={`/catalog?categoryId=${p.categoryId}`}>{p.categoryName}</Link>
          </>
        )}
      </nav>

      {/* ─── Верх: галерея + інфо ─── */}
      <div className="detail__top">
        <ProductGallery images={p.images} name={p.name} />

        <div className="detail__info">
          <div className="detail__badges">
            {p.isNew && <span className="detail__badge detail__badge--new">Новинка</span>}
            {discount && <span className="detail__badge detail__badge--sale">{discount}</span>}
          </div>

          <h1 className="detail__title">{p.name}</h1>

          <div className="detail__rating-row">
            <RatingStars rating={p.avgRating} count={p.reviewCount} size={18} />
          </div>

          <div className="detail__prices">
            <span className={"detail__price" + (p.oldPrice > p.price ? " detail__price--sale" : "")}>
              {formatPrice(currentPrice)}
            </span>
            {p.oldPrice > p.price && (
              <span className="detail__old-price">{formatPrice(p.oldPrice)}</span>
            )}
          </div>

          {variants.length > 0 && (
            <div className="detail__variants">
              <VariantSelector
                variants={variants}
                selectedId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
            </div>
          )}

          <p className={"detail__stock" + (inStock ? "" : " detail__stock--out")}>
            {inStock ? "✓ В наявності" : "Немає в наявності"}
          </p>

          <div className="detail__cta">
            <button type="button" className="btn btn--primary btn--block detail__buy" disabled={!inStock}>
              <CartIcon width={20} height={20} /> Додати в кошик
            </button>
          </div>

          {specs.length > 0 && (
            <dl className="detail__specs">
              {specs.map(([k, v]) => (
                <div className="detail__spec" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* ─── Вкладки ─── */}
      <div className="detail__tabs">
        <div className="detail__tablist" role="tablist">
          <button
            type="button" role="tab" aria-selected={tab === "description"}
            className={"detail__tab" + (tab === "description" ? " detail__tab--active" : "")}
            onClick={() => setTab("description")}
          >
            Опис товару
          </button>
          <button
            type="button" role="tab" aria-selected={tab === "specs"}
            className={"detail__tab" + (tab === "specs" ? " detail__tab--active" : "")}
            onClick={() => setTab("specs")}
          >
            Характеристики
          </button>
        </div>

        <div className="detail__tabpanel" role="tabpanel">
          {tab === "description" ? (
            <p className="detail__description">
              {p.description || "Опис товару відсутній."}
            </p>
          ) : (
            <dl className="detail__specs detail__specs--full">
              {[["Остача на складі", p.stock], ...specs].map(([k, v]) => (
                <div className="detail__spec" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* ─── Відгуки ─── */}
      <section className="detail__reviews section">
        <h2 className="detail__section-title">Відгуки ({p.reviewCount})</h2>

        {reviews.length === 0 && <p className="detail__muted">Відгуків поки немає. Будьте першим!</p>}

        <ul className="detail__review-list">
          {reviews.map((r) => (
            <li key={r.id} className="review">
              <div className="review__head">
                <span className="review__author">{r.customerName}</span>
                <RatingStars rating={r.rating} showCount={false} size={14} />
              </div>
              {r.comment && <p className="review__text">{r.comment}</p>}
              <time className="review__date">
                {new Date(r.createdAt).toLocaleDateString("uk-UA")}
              </time>
            </li>
          ))}
        </ul>

        {customer ? (
          <form className="review-form" onSubmit={handleAddReview}>
            <h3 className="review-form__title">Залишити відгук</h3>
            <label className="review-form__rating">
              Оцінка:
              <select
                className="field"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </label>
            <textarea
              required className="field" rows="3" placeholder="Ваш відгук про товар"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <button type="submit" className="btn btn--primary">Надіслати відгук</button>
            {reviewError && <p className="detail__error">{reviewError}</p>}
          </form>
        ) : (
          <p className="detail__muted">
            <Link to="/login" className="detail__link">Увійдіть</Link>, щоб залишити відгук.
          </p>
        )}
      </section>

      {/* ─── Схожі товари ─── */}
      {p.relatedProducts?.length > 0 && (
        <section className="section">
          <SectionHeader title="З цим товаром купують" />
          <ProductGrid products={p.relatedProducts} />
        </section>
      )}

      {/* ─── Адмін ─── */}
      <ProductAdminPanel product={p} categories={categories} variants={variants} />
    </div>
  );
};

export default ProductDetailPage;
