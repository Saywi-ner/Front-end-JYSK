// src/components/PageTransition.jsx
// Перехід між сторінками: екран м'яко вибілюється, з бічних країв у кадр
// заходять гілки з листям і легенько похитуються, далі вибілення сходить
// і відкриває нову сторінку.
//
// Оверлей не перехоплює кліки (pointer-events: none) і не затримує навігацію:
// маршрут перемикається одразу, анімація лише програється поверх. Навіть якщо
// вона десь не відпрацює, сайт лишиться робочим.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

// Чотири різні гілки, по дві на кожен бік. Праві намальовані одразу
// справа наліво, а не віддзеркалені: дзеркальна копія тієї самої кривої
// впадає в око — гілки читаються як пара, а не як зарості.
//
// Стебло починається за межами viewBox (x менше 0 або більше 220). SVG
// обрізає його рівно по краю, тому в кадрі не видно круглого торця —
// гілка виглядає такою, що продовжується за екран.
const BRANCHES = {
  // ── лівий край, стебла ростуть управо ──
  l1: {
    stem: "M-34 18C18 25 70 40 118 62c24 11 46 24 66 38",
    leaves: [
      [12, 24, -30], [46, 35, 24], [80, 49, -28], [112, 61, 26],
      [142, 77, -26], [168, 93, 22], [190, 109, -24],
    ],
  },
  l2: {
    stem: "M-34 122C22 114 74 99 120 78c26-11 50-25 70-40",
    leaves: [
      [10, 117, 28], [46, 108, -26], [80, 95, 30], [114, 80, -24], [146, 64, 26],
    ],
  },
  // ── правий край, стебла ростуть уліво ──
  r1: {
    stem: "M254 26C202 35 152 52 106 75c-24 12-46 25-66 40",
    leaves: [
      [230, 32, 30], [196, 43, -26], [160, 56, 28], [124, 70, -24],
      [94, 84, 26], [66, 99, -28], [44, 113, 24], [26, 126, -26],
    ],
  },
  r2: {
    stem: "M254 124C200 115 150 100 104 77c-24-12-44-26-62-42",
    leaves: [
      [228, 119, -28], [190, 108, 26], [152, 94, -30],
      [116, 78, 24], [86, 60, -26], [60, 42, 28],
    ],
  },
};

const Branch = ({ side, variant }) => {
  const { stem, leaves } = BRANCHES[variant];
  return (
    <div className={`pt-branch pt-branch--${side}`}>
      <svg className="pt-branch__art" viewBox="0 0 220 150" fill="none" aria-hidden="true">
        <path d={stem} stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <g className="pt-branch__leaves" fill="currentColor">
          {leaves.map(([cx, cy, angle], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={14 - (i % 3) * 1.6}
              ry={6.2 - (i % 3) * 0.5}
              transform={`rotate(${angle} ${cx} ${cy})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

const PageTransition = () => {
  const { pathname } = useLocation();
  const [run, setRun] = useState(0);
  // Зберігаємо саме попередній шлях, а не прапорець «перший рендер»:
  // у StrictMode ефект навмисно викликається двічі, і прапорець встигав
  // скинутись на першому виклику — анімація програвалась одразу при вході.
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

      <Branch side="l-top" variant="l1" />
      <Branch side="l-bottom" variant="l2" />
      <Branch side="r-top" variant="r1" />
      <Branch side="r-bottom" variant="r2" />

      <span className="page-transition__leaf page-transition__leaf--a" />
      <span className="page-transition__leaf page-transition__leaf--b" />
      <span className="page-transition__leaf page-transition__leaf--c" />
      <span className="page-transition__leaf page-transition__leaf--d" />
    </div>
  );
};

export default PageTransition;
