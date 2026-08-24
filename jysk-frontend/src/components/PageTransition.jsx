// src/components/PageTransition.jsx
// Перехід між сторінками: екран м'яко вибілюється, з кутів у кадр заходять
// гілки з листям і легенько похитуються, далі вибілення сходить і відкриває
// нову сторінку.
//
// Оверлей не перехоплює кліки (pointer-events: none) і не затримує навігацію:
// маршрут перемикається одразу, анімація лише програється поверх. Навіть якщо
// вона десь не відпрацює, сайт лишиться робочим.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

// Одна гілка: стебло-крива й листя вздовж нього. Обидва кути малюються
// цією ж формою — другий просто розвернутий через CSS, щоб не дублювати шлях.
const Branch = ({ className }) => (
  <svg className={className} viewBox="0 0 190 130" fill="none" aria-hidden="true">
    <path
      className="branch__stem"
      d="M2 4C38 24 74 48 108 72c18 13 34 26 48 40"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <g className="branch__leaves" fill="currentColor">
      <ellipse cx="34" cy="10" rx="15" ry="6.5" transform="rotate(-32 34 10)" />
      <ellipse cx="52" cy="40" rx="13" ry="6" transform="rotate(28 52 40)" />
      <ellipse cx="82" cy="44" rx="15" ry="6.5" transform="rotate(-30 82 44)" />
      <ellipse cx="104" cy="80" rx="13" ry="6" transform="rotate(26 104 80)" />
      <ellipse cx="132" cy="86" rx="14" ry="6" transform="rotate(-28 132 86)" />
      <ellipse cx="150" cy="118" rx="11" ry="5.2" transform="rotate(24 150 118)" />
    </g>
  </svg>
);

const PageTransition = () => {
  const { pathname } = useLocation();
  // Лічильник, а не булеве значення: зміна key перезапускає CSS-анімацію,
  // навіть коли перехід стався під час попереднього.
  const [run, setRun] = useState(0);
  // Зберігаємо саме попередній шлях, а не прапорець «перший рендер»:
  // у StrictMode ефект навмисно викликається двічі, і прапорець встигав
  // скинутись на першому виклику — анімація програвалась одразу при вході
  // на сайт. Порівняння шляху від повторного виклику захищене.
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setRun((n) => n + 1);
  }, [pathname]);

  if (run === 0) return null;

  return (
    <div className="page-transition" key={run} aria-hidden="true">
      <div className="page-transition__veil" />
      <Branch className="page-transition__branch page-transition__branch--tl" />
      <Branch className="page-transition__branch page-transition__branch--br" />
      <span className="page-transition__leaf page-transition__leaf--a" />
      <span className="page-transition__leaf page-transition__leaf--b" />
      <span className="page-transition__leaf page-transition__leaf--c" />
    </div>
  );
};

export default PageTransition;
