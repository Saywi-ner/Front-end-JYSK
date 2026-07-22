// src/pages/ProfilePage.jsx
// Профіль поточного юзера: GET /customers/me (по JWT з інтерцептора).

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import "./AuthPage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { customer, profile, isLoading, error, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    if (customer) fetchMe();
  }, [customer, fetchMe]);

  if (!customer) {
    return (
      <div className="container auth">
        <div className="auth__card">
          <p className="detail__muted">
            <Link to="/login" className="detail__link">Увійдіть</Link>, щоб побачити профіль.
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const rows = profile && [
    ["Ім'я", `${profile.firstName} ${profile.lastName}`],
    ["Email", profile.email],
    ["Телефон", profile.phoneNumber ?? "—"],
    ["Адреса", profile.address ?? "—"],
    ["Зареєстрований", new Date(profile.createdAt).toLocaleDateString("uk-UA")],
  ];

  return (
    <div className="container auth">
      <div className="auth__card auth__card--wide">
        <h1 className="auth__title">Мій профіль</h1>
        {isLoading && <p className="detail__muted">Завантаження…</p>}
        {error && <p className="auth__error">{error}</p>}

        {rows && (
          <dl className="profile__list">
            {rows.map(([k, v]) => (
              <div className="profile__row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <button type="button" className="btn btn--outline" onClick={handleLogout}>
          Вийти з акаунта
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
