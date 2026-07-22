// src/components/Header.jsx
// Шапка сайту: лого, навігація каталогу, пошук, дії користувача.
// Пошук веде на /search?search=...

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { SearchIcon, HeartIcon, CartIcon, UserIcon, MenuIcon, CloseIcon } from "./icons";
import "./Header.css";

const NAV = [
  { to: "/catalog", label: "Каталог" },
  { to: "/categories", label: "Категорії" },
  { to: "/catalog?onSale=1", label: "Акції" },
];

const Header = () => {
  const navigate = useNavigate();
  const { customer } = useAuthStore();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?search=${encodeURIComponent(q)}` : "/search");
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <button
          type="button"
          className="header__burger"
          aria-label="Меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="header__logo" onClick={() => setMenuOpen(false)}>
          TALO
        </Link>

        <nav className={"header__nav" + (menuOpen ? " header__nav--open" : "")}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="header__nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form className="header__search" role="search" onSubmit={submitSearch}>
          <SearchIcon className="header__search-icon" width={20} height={20} />
          <input
            type="search"
            className="header__search-input"
            placeholder="Пошук товарів…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Пошук товарів"
          />
        </form>

        <div className="header__actions">
          <button type="button" className="header__icon-btn" aria-label="Обране">
            <HeartIcon width={22} height={22} />
          </button>
          <Link
            to={customer ? "/profile" : "/login"}
            className="header__icon-btn header__icon-btn--user"
            aria-label={customer ? "Профіль" : "Увійти"}
          >
            <UserIcon width={22} height={22} />
            {customer && <span className="header__user-name">{customer.firstName}</span>}
          </Link>
          <button type="button" className="header__icon-btn" aria-label="Кошик">
            <CartIcon width={22} height={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
