// src/pages/LoginPage.jsx
// Вхід і реєстрація. POST /auth/login | POST /auth/register

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import "./AuthPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuthStore();

  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phoneNumber: "",
  });

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = mode === "login"
      ? await login(form.email, form.password)
      : await register(form);
    if (ok) navigate("/");
  };

  return (
    <div className="container auth">
      <div className="auth__card">
        <h1 className="auth__title">{mode === "login" ? "Вхід" : "Реєстрація"}</h1>
        <p className="auth__switch">
          {mode === "login" ? "Немає акаунта?" : "Вже є акаунт?"}{" "}
          <button
            type="button" className="auth__switch-btn"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Зареєструватись" : "Увійти"}
          </button>
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input required className="field" placeholder="Ім'я"
                value={form.firstName} onChange={set("firstName")} />
              <input required className="field" placeholder="Прізвище"
                value={form.lastName} onChange={set("lastName")} />
              <input className="field" placeholder="Телефон (+380…)"
                value={form.phoneNumber} onChange={set("phoneNumber")} />
            </>
          )}
          <input required type="email" className="field" placeholder="Email"
            value={form.email} onChange={set("email")} />
          <input required type="password" className="field" placeholder="Пароль"
            value={form.password} onChange={set("password")} />
          <button type="submit" className="btn btn--primary btn--block" disabled={isLoading}>
            {isLoading ? "…" : mode === "login" ? "Увійти" : "Зареєструватись"}
          </button>
        </form>

        {error && <p className="auth__error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
