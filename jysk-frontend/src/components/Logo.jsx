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
      viewBox="0 0 36 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Зовнішній схил даху */}
      <path d="M2.5 37.5 18 3.5 33.5 37.5" />
      {/* Внутрішній схил */}
      <path d="M9.5 37.5 18 19 26.5 37.5" strokeWidth="4.5" />
      {/* Крапка під гребенем */}
      <circle cx="18" cy="30" r="2.8" fill="currentColor" stroke="none" />
    </svg>

    <span aria-hidden="true">LO</span>
  </span>
);

export default Logo;
