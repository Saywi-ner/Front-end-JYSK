// src/pages/InfoPage.jsx
// Спільний шаблон інформаційних сторінок. Сам контент — у src/content/infoPages.js.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { findInfoPage } from "../content/infoPages";
import NotFoundPage from "./NotFoundPage";
import { ChevronRight } from "../components/icons";
import "./InfoPage.css";

const InfoPage = ({ slug }) => {
  const page = findInfoPage(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  // Сторінку рендеримо зі списку: якщо маршрут є, а контенту немає —
  // чесніше показати 404, ніж порожній каркас.
  if (!page) return <NotFoundPage />;

  return (
    <div className="container info">
      <nav className="info__breadcrumbs" aria-label="Навігація">
        <Link to="/">Головна</Link>
        <ChevronRight width={14} height={14} />
        <span>{page.title}</span>
      </nav>

      <header className="info__head">
        <h1 className="info__title">{page.title}</h1>
        {page.lead && <p className="info__lead">{page.lead}</p>}
      </header>

      {page.sections.map((section, i) => (
        <section className="info__section" key={i}>
          {section.title && <h2 className="info__section-title">{section.title}</h2>}

          {section.text?.map((paragraph, j) => (
            <p className="info__text" key={j}>{paragraph}</p>
          ))}

          {section.list && (
            <ul className="info__list">
              {section.list.map((item, j) => (
                <li className="info__list-item" key={j}>{item}</li>
              ))}
            </ul>
          )}

          {section.cards && (
            <ul className="info__cards">
              {section.cards.map((card, j) => (
                <li className="info-card" key={j}>
                  <h3 className="info-card__title">{card.title}</h3>
                  <p className="info-card__text">{card.text}</p>
                </li>
              ))}
            </ul>
          )}

          {section.facts && (
            <dl className="info__facts">
              {section.facts.map(([term, value], j) => (
                <div className="info__fact" key={j}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}

      <p className="info__back">
        <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
      </p>
    </div>
  );
};

export default InfoPage;
