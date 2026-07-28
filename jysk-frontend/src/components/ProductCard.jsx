// src/components/ProductCard.jsx
// Картка товару за макетом TALO (Figma): медіа з круглим бейджем і сердечком,
// назва, короткий опис, рейтинг, стара/нова ціна та кругла кнопка кошика.
//
// Поля з GET /products: { id, name, description, price, oldPrice, isNew,
//   categoryName, imageUrl|mainImageUrl, avgRating, reviewCount, ... }

import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import { CartIcon, HeartIcon } from "./icons";
import { formatPrice, discountPercent, productImage } from "../utils/format";
import "./ProductCard.css";

const ProductCard = ({ product, onDelete, onAddToCart, onToggleWish, wished }) => {
  const img = productImage(product);
  const discount = discountPercent(product.price, product.oldPrice);
  const hasDiscount = Boolean(discount);

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link
          to={`/products/${product.id}`}
          className="product-card__image-link"
          aria-label={product.name}
        >
          {img ? (
            <img
              className="product-card__image"
              src={img}
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <span className="product-card__placeholder">TALO</span>
          )}
        </Link>

        {/* Бейджі — круглі, у лівому верхньому куті (як у макеті). */}
        <div className="product-card__badges">
          {hasDiscount && (
            <span className="product-card__badge product-card__badge--sale">
              {discount}
            </span>
          )}
          {product.isNew && (
            <span className="product-card__badge product-card__badge--new">NEW</span>
          )}
        </div>

        <button
          type="button"
          className={
            "product-card__wish" + (wished ? " product-card__wish--active" : "")
          }
          aria-pressed={wished ? "true" : "false"}
          aria-label="До обраного"
          onClick={() => onToggleWish?.(product)}
        >
          <HeartIcon filled={wished} width={20} height={20} />
        </button>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Опис і рядок старої ціни рендеримо завжди — навіть порожніми.
            Інакше картки без опису чи без знижки виходять нижчими за сусідні
            й ряд у сітці «розсипається» по висоті. */}
        <p className="product-card__desc">{product.description}</p>

        <RatingStars rating={product.avgRating} count={product.reviewCount} size={14} />

        <div className="product-card__footer">
          <div className="product-card__prices">
            <span className="product-card__old-price" aria-hidden={!hasDiscount}>
              {hasDiscount ? formatPrice(product.oldPrice) : " "}
            </span>
            <span
              className={
                "product-card__price" +
                (hasDiscount ? " product-card__price--sale" : "")
              }
            >
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            className="product-card__cart"
            aria-label={`Додати «${product.name}» в кошик`}
            onClick={() => onAddToCart?.(product)}
          >
            <CartIcon width={20} height={20} />
          </button>
        </div>

        {onDelete && (
          <button
            type="button"
            className="product-card__delete"
            onClick={() => onDelete(product.id)}
          >
            Видалити
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
