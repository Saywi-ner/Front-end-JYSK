// src/components/SectionHeader.jsx
// Заголовок секції з опційним посиланням "Дивитись всі".

import { Link } from "react-router-dom";
import { ChevronRight } from "./icons";
import "./SectionHeader.css";

// withDots: у макеті точками виділені блоки товарів, а службові секції
// («Пошук по кімнатах», «Акції») йдуть простим заголовком.
const SectionHeader = ({ title, linkTo, linkText = "Дивитись всі", withDots = true }) => (
  <header className="section-header">
    <h2 className="section-header__title">
      {withDots && <span className="section-header__dots" aria-hidden="true" />}
      {title}
      {withDots && <span className="section-header__dots" aria-hidden="true" />}
    </h2>
    {linkTo && (
      <Link className="section-header__link" to={linkTo}>
        {linkText}
        <ChevronRight width={18} height={18} />
      </Link>
    )}
  </header>
);

export default SectionHeader;
