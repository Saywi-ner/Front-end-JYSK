// src/components/ProductCard.jsx
// Картка товару для сіток каталогу/головної.
// Поля з GET /products: { id, name, price, oldPrice, isNew, categoryName,
//                         mainImageUrl|imageUrl, avgRating, reviewCount, ... }

import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import { CartIcon, HeartIcon } from "./icons";
import { formatPrice, discountPercent, productImage } from "../utils/format";
import "./ProductCard.css";

const ProductCard = ({ product, onDelete, onAddToCart, onToggleWish, wished }) => {
  const img = productImage(product);
  const discount = discountPercent(product.price, product.oldPrice);

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

        <div className="product-card__badges">
          {product.isNew && (
            <span className="product-card__badge product-card__badge--new">Новинка</span>
          )}
          {discount && (
            <span className="product-card__badge product-card__badge--sale">{discount}</span>
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
          <HeartIcon filled={wished} width={18} height={18} />
        </button>
      </div>

      <div className="product-card__body">
        {product.categoryName && (
          <span className="product-card__category">{product.categoryName}</span>
        )}
        <h3 className="product-card__title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <RatingStars rating={product.avgRating} count={product.reviewCount} size={15} />

        <div className="product-card__footer">
          <div className="product-card__prices">
            {product.oldPrice > product.price && (
              <span className="product-card__old-price">{formatPrice(product.oldPrice)}</span>
            )}
            <span
              className={
                "product-card__price" +
                (product.oldPrice > product.price ? " product-card__price--sale" : "")
              }
            >
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            className="product-card__cart"
            aria-label="Додати в кошик"
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
