// src/pages/ProfilePage.jsx
// Профіль поточного юзера: GET /customers/me (по JWT з інтерцептора)
// та PUT /customers/me для редагування. Email і роль тут не змінюються —
// їх бекенд не приймає в цьому запиті.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { formatDate } from "../utils/format";
import "./AuthPage.css";
import "./ShopPages.css";

// Форма отримує початкові значення пропсами й монтується з key={profile.id}:
// так стан заповнюється один раз при відкритті, без синхронізації в useEffect,
// яка перетирала б уже введений текст на кожен новий рендер профілю.
const ProfileForm = ({ profile, isLoading, onSave, onCancel }) => {
  const [form, setForm] = useState({
    firstName:   profile.firstName ?? "",
    lastName:    profile.lastName ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    address:     profile.address ?? "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      firstName:   form.firstName.trim(),
      lastName:    form.lastName.trim(),
      phoneNumber: form.phoneNumber.trim() || null,
      address:     form.address.trim() || null,
    });
  };

  return (
    <form className="shop__form" onSubmit={handleSubmit}>
      <label>
        Ім'я
        <input required className="field" maxLength={100}
          value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      </label>
      <label>
        Прізвище
        <input required className="field" maxLength={100}
          value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      </label>
      <label>
        Телефон
        <input className="field" maxLength={20} placeholder="+380…"
          value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
      </label>
      <label>
        Адреса доставки
        <input className="field" maxLength={500} placeholder="Місто, вулиця, будинок"
          value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </label>

      <div className="shop__actions">
        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? "Зберігаємо…" : "Зберегти"}
        </button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>
          Скасувати
        </button>
      </div>
    </form>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { customer, profile, isLoading, error, fetchMe, updateProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async (payload) => {
    const ok = await updateProfile(payload);
    if (ok) setIsEditing(false);
  };

  const rows = profile && [
    ["Ім'я", `${profile.firstName} ${profile.lastName}`],
    ["Email", profile.email],
    ["Телефон", profile.phoneNumber ?? "—"],
    ["Адреса", profile.address ?? "—"],
    ["Зареєстрований", formatDate(profile.createdAt)],
  ];

  return (
    <div className="container auth">
      <div className="auth__card auth__card--wide">
        <h1 className="auth__title">Мій профіль</h1>
        {isLoading && !profile && <p className="detail__muted">Завантаження…</p>}
        {error && <p className="auth__error">{error}</p>}

        {isEditing && profile ? (
          <ProfileForm
            key={profile.id}
            profile={profile}
            isLoading={isLoading}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
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

            <div className="shop__actions">
              <button
                type="button"
                className="btn btn--primary"
                disabled={!profile}
                onClick={() => setIsEditing(true)}
              >
                Редагувати профіль
              </button>
              <Link to="/orders" className="btn btn--outline">Мої замовлення</Link>
              {customer?.role === "Admin" && (
                <Link to="/admin/orders" className="btn btn--outline">Замовлення магазину</Link>
              )}
              <button type="button" className="btn btn--outline" onClick={handleLogout}>
                Вийти з акаунта
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
