// src/components/ProductCard.jsx
// Карточка товара для каталога. Без стилей — только данные.
// Поля приходят из GET /products: { id, name, price, imageUrl }

import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <article>
      <Link to={`/products/${product.id}`}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} width="160" />
        ) : (
          <span>[нет фото]</span>
        )}
        <h3>{product.name}</h3>
      </Link>
      <p>{product.price} ₴</p>
    </article>
  );
};

export default ProductCard;
