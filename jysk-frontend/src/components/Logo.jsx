// src/components/Logo.jsx
// Логотип TALO за макетом: замість літери «A» — знак-дах із крапкою.
// «Talo» фінською означає «дім», тож літера стилізована під дах будинку.
//
// Літери набрані шрифтом макета (Fixel Display), а не намальовані вручну:
// так накреслення точно збігається з рештою заголовків. Кастомний лише знак.
// Колір успадковується через currentColor — у десктопній шапці лого зелене,
// у мобільній і в підвалі біле, без окремих варіантів компонента.

import "./Logo.css";

const Logo = ({ className = "" }) => (
  <span className={`logo ${className}`.trim()} aria-label="TALO" role="img">
    <span aria-hidden="true">T</span>

    <svg
      className="logo__mark"
      viewBox="0 0 48 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Зовнішній схил даху. Широкий розліт ніжок і гребінь, піднятий над
          рядком: у макеті знак ширший за літеру й виступає над прописними,
          а ніжки стоять на базовій лінії. */}
      <path d="M3 41 24 3.2 45 41" />
      {/* Внутрішній схил */}
      <path d="M12 41 24 19.8 36 41" strokeWidth="4.2" />
      {/* Перемички знизу: замикають зовнішній і внутрішній схили,
          через них дах читається суцільним контуром, а не двома «галочками». */}
      <path d="M3 41H12" strokeWidth="4.2" />
      <path d="M36 41H45" strokeWidth="4.2" />
      {/* Крапка під гребенем — трохи ширша за висоту й посаджена ближче
          до перемичок, як у макеті. */}
      <ellipse cx="24" cy="34.6" rx="4" ry="3" fill="currentColor" stroke="none" />
    </svg>

    <span aria-hidden="true">LO</span>
  </span>
);

export default Logo;
