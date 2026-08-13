// src/components/ScrollToTop.jsx
// React Router сохраняет позицию скролла между маршрутами: переход из середины
// каталога открывал следующую страницу прокрученной вниз. Сбрасываем при смене
// пути — но не при смене query-параметров, иначе фильтры каталога дёргали бы
// страницу вверх на каждый чих.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
