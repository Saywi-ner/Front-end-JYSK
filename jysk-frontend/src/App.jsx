// src/App.jsx — каркас приложения + маршруты.
// Стилей намеренно нет: задача сейчас — показать данные с эндпоинтов.

import { Routes, Route, Link, Navigate } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/catalog">JYSK · Каталог</Link>
        </nav>
      </header>
      <hr />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<p>Страница не найдена</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
