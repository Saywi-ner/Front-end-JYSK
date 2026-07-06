// src/pages/ProductDetailPage.jsx
// Деталка товара: GET /products/:id -> { id, name, description, price, categoryName, images: [] }

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useProductStore from "../stores/productStore";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { selectedProduct, isLoading, error, fetchProductById } = useProductStore();

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (isLoading) return <p>Загрузка товара…</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!selectedProduct) return null;

  const p = selectedProduct;

  return (
    <div>
      <p>
        <Link to="/catalog">← к каталогу</Link>
      </p>

      <h1>{p.name}</h1>
      <p>Категория: {p.categoryName}</p>
      <p>Цена: {p.price} ₴</p>
      {p.description && <p>{p.description}</p>}

      <div>
        {p.images && p.images.length > 0 ? (
          p.images.map((url, i) => (
            <img key={i} src={url} alt={`${p.name} ${i + 1}`} width="200" />
          ))
        ) : (
          <span>[нет фото]</span>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
