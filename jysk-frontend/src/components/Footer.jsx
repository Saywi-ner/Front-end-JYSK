// src/components/Footer.jsx
// Підвал сайту: бренд, колонки посилань, контакти, копірайт.

import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Про TALO",
    links: [
      { to: "/about", label: "Про нас" },
      { to: "/stores", label: "Магазини" },
      { to: "/careers", label: "Вакансії" },
      { to: "/b2b", label: "B2B" },
    ],
  },
  {
    title: "Допомога",
    links: [
      { to: "/delivery", label: "Доставка та оплата" },
      { to: "/returns", label: "Повернення" },
      { to: "/warranty", label: "Гарантія" },
      { to: "/support", label: "Підтримка" },
      { to: "/contacts", label: "Контакти" },
    ],
  },
  {
    title: "Каталог",
    links: [
      { to: "/catalog", label: "Усі товари" },
      { to: "/categories", label: "Категорії" },
      { to: "/catalog?onSale=1", label: "Акції" },
      { to: "/catalog?isNew=1", label: "Новинки" },
    ],
  },
];

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <Link to="/" className="footer__logo"><Logo /></Link>
        <p className="footer__tagline">Просто для життя, затишку та злагоди.</p>
        <a href="tel:+380660001081" className="footer__phone">+38 (066) 000 10 81</a>
        <p className="footer__hours">Щодня з 9:00 до 20:00</p>
      </div>

      <nav className="footer__columns" aria-label="Підвал">
        {COLUMNS.map((col) => (
          <div className="footer__col" key={col.title}>
            <h3 className="footer__col-title">{col.title}</h3>
            <ul className="footer__links">
              {col.links.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>

    <div className="footer__bar">
      <div className="container footer__bar-inner">
        <p className="footer__copy">© {new Date().getFullYear()} TALO. Усі права захищені.</p>
        <ul className="footer__pay" aria-label="Способи оплати">
          <li className="footer__pay-item">VISA</li>
          <li className="footer__pay-item">MC</li>
          <li className="footer__pay-item">Apple&nbsp;Pay</li>
          <li className="footer__pay-item">G&nbsp;Pay</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
