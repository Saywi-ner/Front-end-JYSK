// src/pages/CatalogPage.jsx
// Каталог: тянет список товаров через стор и рендерит карточки.
// Запрос идёт в компоненте через метод стора, а не напрямую через axios.

import { useEffect, useState } from "react";
import useProductStore from "../stores/productStore";
import ProductCard from "../components/ProductCard";

const CatalogPage = () => {
  const { items, isLoading, error, fetchProducts } = useProductStore();
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    // Пустой categoryId => грузим все товары. С числом => фильтр по категории.
    const params = categoryId ? { categoryId: Number(categoryId) } : {};
    fetchProducts(params);
  }, [categoryId, fetchProducts]);

  return (
    <div>
      <h1>Каталог товаров</h1>

      <label>
        Фильтр по категории (id):{" "}
        <input
          type="number"
          min="1"
          placeholder="все"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
      </label>

      {isLoading && <p>Загрузка товаров…</p>}
      {error && <p>Ошибка: {error}</p>}
      {!isLoading && !error && items.length === 0 && <p>Товаров пока нет.</p>}

      <div>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
