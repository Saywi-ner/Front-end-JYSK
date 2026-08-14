// src/components/icons.jsx
// Набір інлайн-SVG іконок. stroke="currentColor" — колір керується через CSS.

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const TrashIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M10 4h4M9 7v11M15 7v11M6 7l1 13h10l1-13" />
  </svg>
);

export const FilterIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 6h14M8 12h8M10 18h4" />
  </svg>
);

// Половинки серця дзеркальні відносно осі x=12: виїмка зверху рівно по центру,
// а контрольні точки правої частини — відображення лівої. Попередній контур
// мав виїмку в x=10 і ширшу ліву долю, через що іконка виглядала кривою.
export const HeartIcon = ({ filled, ...p }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...p}>
    <path
      d="M12 20.5C8.5 17.5 2.5 13.2 2.5 9.2C2.5 6.4 4.7 4.5 7.2 4.5C9.3 4.5 11 5.9 12 7.8C13 5.9 14.7 4.5 16.8 4.5C19.3 4.5 21.5 6.4 21.5 9.2C21.5 13.2 15.5 17.5 12 20.5Z"
    />
  </svg>
);

export const CartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L21 8H6" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </svg>
);

export const UserIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" />
  </svg>
);

export const StarIcon = ({ filled, ...p }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.9L12 3.5Z" />
  </svg>
);

export const ChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronLeft = (p) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
