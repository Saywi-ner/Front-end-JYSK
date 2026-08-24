// src/components/PageTransition.jsx
// Перехід між сторінками: екран м'яко вибілюється, згори звисають гілки
// з листям і гойдаються, далі вибілення сходить і відкриває нову сторінку.
//
// Оверлей не перехоплює кліки (pointer-events: none) і не затримує навігацію:
// маршрут перемикається одразу, анімація лише програється поверх. Навіть якщо
// вона десь не відпрацює, сайт лишиться робочим.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

// Чотири різні гілки, що звисають згори.
//
// Стебло починається вище viewBox (y менше нуля) — SVG обрізає його рівно
// по краю, тому вгорі не видно круглого торця й гілка читається як продовжена
// за екран.
//
// Кінець гілки не обрубаний: у нього входять бічні відростки (twigs) і
// кінцева брунька (tip). Разом із листям, що дрібнішає до вершини, це читається
// як жива гілка, а не як дуга сталої товщини.
//
// leaves: [cx, cy, кут] — кути близькі до вертикальних, щоб листя обвисало.
const BRANCHES = {
  a: {
    stem: "M74-24C70 28 58 72 66 116c8 42 22 78 12 118",
    twigs: ["M70 104c-9 6-14 15-16 26", "M68 152c10 8 16 20 18 32"],
    leaves: [
      [54, 26, 62], [90, 50, -58], [56, 80, 66], [92, 108, -60],
      [58, 138, 64], [92, 166, -56], [64, 196, 60],
    ],
    tip: [78, 234, 12],
  },
  b: {
    stem: "M62-24C68 24 82 58 74 98c-8 38-18 68-6 104",
    twigs: ["M76 120c-9 7-14 17-16 28"],
    leaves: [
      [46, 30, -64], [92, 52, 58], [50, 82, -60], [90, 110, 62], [56, 142, -58],
    ],
    tip: [68, 202, -10],
  },
  c: {
    stem: "M80-24C74 30 60 66 70 108c9 40 24 72 14 110",
    twigs: ["M72 96c-10 6-15 16-17 27", "M74 150c11 8 17 21 19 33"],
    leaves: [
      [60, 24, 60], [98, 48, -62], [58, 78, 64], [98, 104, -58],
      [62, 134, 62], [100, 162, -60], [68, 190, 58], [96, 214, -56],
    ],
    tip: [84, 218, 14],
  },
  d: {
    stem: "M66-24C72 26 86 56 78 96c-8 36-16 64-4 100",
    twigs: ["M78 128c-10 7-15 18-17 29"],
    leaves: [
      [50, 28, -60], [94, 50, 62], [52, 80, -64], [94, 106, 58],
      [58, 136, -62], [90, 162, 60],
    ],
    tip: [74, 196, -12],
  },
};

const Branch = ({ slot, variant }) => {
  const { stem, twigs, leaves, tip } = BRANCHES[variant];
  const [tipX, tipY, tipAngle] = tip;

  return (
    <div className={`pt-branch pt-branch--${slot}`}>
      <svg className="pt-branch__art" viewBox="0 0 150 250" fill="none" aria-hidden="true">
        <path d={stem} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        {twigs.map((d, i) => (
          <path key={i} d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        ))}

        <g className="pt-branch__leaves" fill="currentColor">
          {leaves.map(([cx, cy, angle], i) => {
            // Листя дрібнішає до кінця гілки — біля основи воно найбільше.
            const k = 1 - (i / leaves.length) * 0.42;
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={13 * k}
                ry={5.8 * k}
                transform={`rotate(${angle} ${cx} ${cy})`}
              />
            );
          })}
          {/* Кінцева брунька: ховає торець стебла й завершує гілку. */}
          <ellipse
            cx={tipX}
            cy={tipY}
            rx="3.4"
            ry="6.6"
            transform={`rotate(${tipAngle} ${tipX} ${tipY})`}
          />
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

      <Branch slot="one" variant="a" />
      <Branch slot="two" variant="b" />
      <Branch slot="three" variant="c" />
      <Branch slot="four" variant="d" />

      <span className="page-transition__leaf page-transition__leaf--a" />
      <span className="page-transition__leaf page-transition__leaf--b" />
      <span className="page-transition__leaf page-transition__leaf--c" />
    </div>
  );
};

export default PageTransition;
