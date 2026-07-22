// src/components/ProductGrid.jsx
// Адаптивна сітка карток товарів (auto-fill, Mobile First).

import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products, onDelete, onAddToCart, empty = "Товарів не знайдено." }) => {
  if (!products || products.length === 0) {
    return <p className="product-grid__empty">{empty}</p>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onDelete={onDelete}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
