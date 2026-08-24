// src/components/PageTransition.jsx
// Перехід між сторінками: екран м'яко вибілюється, з чотирьох кутів у кадр
// заходять гілки з листям і легенько похитуються, далі вибілення сходить
// і відкриває нову сторінку.
//
// Оверлей не перехоплює кліки (pointer-events: none) і не затримує навігацію:
// маршрут перемикається одразу, анімація лише програється поверх. Навіть якщо
// вона десь не відпрацює, сайт лишиться робочим.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

// Чотири різні гілки — не одна форма в дзеркальних копіях. Дзеркалення саме
// по собі впадає в око: однакові вигини в протилежних кутах читаються як
// візерунок, а не як зарості. Тому в кожної свій вигин, довжина й кількість
// листя, а віддзеркалення лише доводить її до потрібного кута.
//
// leaves: [cx, cy, кут повороту] уздовж стебла.
const BRANCHES = {
  a: {
    stem: "M2 5C46 26 92 52 132 84c22 18 44 34 66 52",
    leaves: [
      [36, 12, -34], [58, 44, 26], [88, 50, -30], [110, 86, 24],
      [140, 96, -28], [164, 124, 22], [186, 132, -26],
    ],
  },
  b: {
    stem: "M2 3C34 34 66 66 96 100c14 16 26 30 38 42",
    leaves: [
      [26, 26, -40], [52, 58, 30], [74, 84, -34], [98, 112, 28], [124, 136, -30],
    ],
  },
  c: {
    stem: "M2 8C40 22 80 40 116 66c20 15 38 32 54 52",
    leaves: [
      [34, 14, -28], [66, 34, 24], [96, 58, -32],
      [122, 80, 26], [146, 104, -28], [170, 126, 24],
    ],
  },
  d: {
    stem: "M2 4C52 20 102 42 146 72c26 18 50 38 72 60",
    leaves: [
      [30, 10, -30], [56, 28, 26], [84, 42, -28], [110, 60, 24],
      [134, 76, -30], [156, 96, 26], [176, 114, -26], [194, 132, 22],
    ],
  },
};

const Branch = ({ corner, variant }) => {
  const { stem, leaves } = BRANCHES[variant];
  return (
    // Позиція та рух — на обгортці, дзеркалення — на самій графіці:
    // інакше flip і анімований transform боролися б за одну властивість.
    <div className={`pt-branch pt-branch--${corner}`}>
      <svg className="pt-branch__art" viewBox="0 0 220 150" fill="none" aria-hidden="true">
        <path
          d={stem}
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
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

      <Branch corner="tl" variant="a" />
      <Branch corner="tr" variant="b" />
      <Branch corner="bl" variant="c" />
      <Branch corner="br" variant="d" />

      <span className="page-transition__leaf page-transition__leaf--a" />
      <span className="page-transition__leaf page-transition__leaf--b" />
      <span className="page-transition__leaf page-transition__leaf--c" />
      <span className="page-transition__leaf page-transition__leaf--d" />
    </div>
  );
};

export default PageTransition;
