// src/components/Header.jsx
// Шапка сайту: смуга-оголошення, лого, навігація каталогу, пошук, дії.
// Пошук веде на /search?search=...
//
// Мобільна версія за макетом: темно-зелена смуга з бургером, білим лого,
// полем пошуку та кошиком. Обране й профіль переїжджають у висувне меню —
// у вузькій шапці для них немає місця, але з сайту вони зникати не мають.

import { useEffect, useState } from "react";
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

  // Поки меню відкрите, сторінка під ним не скролиться — інакше на телефоні
  // фон «їде» під пальцем замість списку меню.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?search=${encodeURIComponent(q)}` : "/search");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <p className="header__promo">−20% на товари та послуги</p>

      <div className="header__bar">
        <div className="container header__inner">
          <button
            type="button"
            className="header__burger"
            aria-label={menuOpen ? "Закрити меню" : "Меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link to="/" className="header__logo" onClick={closeMenu}>
            TALO
          </Link>

          <nav className="header__nav">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className="header__nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <form className="header__search" role="search" onSubmit={submitSearch}>
            <input
              type="search"
              className="header__search-input"
              placeholder="Пошук товарів…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Пошук товарів"
            />
            <button type="submit" className="header__search-btn" aria-label="Знайти">
              <SearchIcon width={18} height={18} />
            </button>
          </form>

          <div className="header__actions">
            <button
              type="button"
              className="header__icon-btn header__icon-btn--desktop"
              aria-label="Обране"
            >
              <HeartIcon width={22} height={22} />
            </button>
            <Link
              to={customer ? "/profile" : "/login"}
              className="header__icon-btn header__icon-btn--desktop"
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
      </div>

      {/* ─── Висувне меню (мобільні) ─── */}
      {menuOpen && (
        <>
          <button
            type="button"
            className="header__overlay"
            aria-label="Закрити меню"
            onClick={closeMenu}
          />
          <nav className="header__drawer" aria-label="Головне меню">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="header__drawer-link"
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}

            <hr className="header__drawer-sep" />

            <Link
              to={customer ? "/profile" : "/login"}
              className="header__drawer-link"
              onClick={closeMenu}
            >
              <UserIcon width={20} height={20} />
              {customer ? customer.firstName : "Увійти"}
            </Link>
            <button type="button" className="header__drawer-link" onClick={closeMenu}>
              <HeartIcon width={20} height={20} />
              Обране
            </button>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
