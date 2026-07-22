// src/components/SectionHeader.jsx
// Заголовок секції з опційним посиланням "Дивитись всі".

import { Link } from "react-router-dom";
import { ChevronRight } from "./icons";
import "./SectionHeader.css";

const SectionHeader = ({ title, linkTo, linkText = "Дивитись всі" }) => (
  <header className="section-header">
    <h2 className="section-header__title">
      <span className="section-header__dots" aria-hidden="true" />
      {title}
      <span className="section-header__dots" aria-hidden="true" />
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
