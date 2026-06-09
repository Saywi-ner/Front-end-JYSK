import { useEffect } from "react";
import useProductStore from "../stores/productStore";
import ProductCard from "../components/ProductCard";

const CatalogPage = () => {
  const { items, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    // Шлем запрос. Пока бэка нет, тут будет ловить catch из стора
    fetchProducts({ categoryId: 1 }); 
  }, [fetchProducts]);

  if (isLoading) return <div>Загрузка товаров...</div>;
  if (error) return <div>Ой! {error} (Но мы можем отрендерить моки)</div>;

  return (
    <div className="catalog-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CatalogPage;