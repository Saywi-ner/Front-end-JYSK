// src/components/Header.jsx
// Шапка сайту: смуга-оголошення, лого, навігація каталогу, пошук, дії.
// Пошук веде на /search?search=...
//
// Мобільна версія за макетом: темно-зелена смуга з бургером, білим лого,
// полем пошуку та кошиком. Обране й профіль переїжджають у висувне меню —
// у вузькій шапці для них немає місця, але з сайту вони зникати не мають.

import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import useCartStore from "../stores/cartStore";
import useWishlistStore from "../stores/wishlistStore";
import Logo from "./Logo";
import { SearchIcon, HeartIcon, CartIcon, UserIcon, MenuIcon, CloseIcon, FilterIcon } from "./icons";
import "./Header.css";

const NAV = [
  { to: "/catalog", label: "Каталог" },
  { to: "/categories", label: "Категорії" },
  { to: "/rooms", label: "Кімнати" },
  { to: "/collections", label: "Колекції" },
  { to: "/catalog?onSale=1", label: "Акції" },
];

// NavLink порівнює лише шлях, тому «Каталог» і «Акції» підсвічувались разом:
// обидва ведуть на /catalog. Звіряємо ще й query-рядок.
const useIsActiveLink = () => {
  const { pathname, search } = useLocation();
  return (to) => {
    const [path, query = ""] = to.split("?");
    if (pathname !== path) return false;
    return new URLSearchParams(search).toString() === new URLSearchParams(query).toString();
  };
};

const Header = () => {
  const navigate = useNavigate();
  const isActive = useIsActiveLink();
  const { customer } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.items.length);
  // Без цього посилання в адмінку можна було потрапити лише вручну за адресою.
  const isAdmin = customer?.role === "Admin";

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
            <Logo />
          </Link>

          <nav className="header__nav">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={() =>
                  "header__nav-link" + (isActive(item.to) ? " active" : "")
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className="header__nav-link header__nav-link--admin">
                Адмінка
              </NavLink>
            )}
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
            <Link
              to="/wishlist"
              className="header__icon-btn header__icon-btn--desktop"
              aria-label={`Обране (${wishCount})`}
            >
              <HeartIcon width={22} height={22} />
              {wishCount > 0 && <span className="header__badge">{wishCount}</span>}
            </Link>
            <Link
              to={customer ? "/profile" : "/login"}
              className="header__icon-btn header__icon-btn--desktop"
              aria-label={customer ? "Профіль" : "Увійти"}
            >
              <UserIcon width={22} height={22} />
              {customer && <span className="header__user-name">{customer.firstName}</span>}
            </Link>
            <Link to="/cart" className="header__icon-btn" aria-label={`Кошик (${cartCount})`}>
              <CartIcon width={22} height={22} />
              {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
            </Link>
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
                end
                className={() =>
                  "header__drawer-link" + (isActive(item.to) ? " active" : "")
                }
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
            {customer && (
              <Link to="/orders" className="header__drawer-link" onClick={closeMenu}>
                <CartIcon width={20} height={20} />
                Мої замовлення
              </Link>
            )}
            <Link to="/wishlist" className="header__drawer-link" onClick={closeMenu}>
              <HeartIcon width={20} height={20} />
              Обране{wishCount > 0 ? ` (${wishCount})` : ""}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="header__drawer-link" onClick={closeMenu}>
                <FilterIcon width={20} height={20} />
                Адмінка
              </Link>
            )}
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
