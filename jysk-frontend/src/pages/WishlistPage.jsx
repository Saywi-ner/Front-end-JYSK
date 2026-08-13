// src/pages/WishlistPage.jsx
// Обране. Список локальний (wishlistStore), картки — ті самі, що в каталозі.

import { Link } from "react-router-dom";
import useWishlistStore from "../stores/wishlistStore";
import ProductGrid from "../components/ProductGrid";
import "./ShopPages.css";

const WishlistPage = () => {
  const { items, clear } = useWishlistStore();

  return (
    <div className="container shop">
      <header className="shop__head">
        <h1 className="shop__title">Обране</h1>
        <p className="shop__sub">
          {items.length > 0 ? `Збережено товарів: ${items.length}` : "Список порожній"}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="shop__empty">
          <p>Натисніть сердечко на картці товару, щоб зберегти його сюди.</p>
          <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
        </div>
      ) : (
        <>
          <ProductGrid products={items} empty="Список порожній." />
          <div className="shop__actions">
            <button type="button" className="btn btn--outline" onClick={clear}>
              Очистити список
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
