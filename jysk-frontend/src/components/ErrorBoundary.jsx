// src/components/ErrorBoundary.jsx
// Любая ошибка рендера роняла всё дерево в белый экран без единого следа
// на странице. Здесь она превращается в понятное сообщение, а сам стек
// остаётся в консоли для отладки.

import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Помилка рендеру:", error, info);
  }

  handleReset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="container section">
        <h1 className="detail__section-title">Щось пішло не так</h1>
        <p className="detail__muted">
          Сторінку не вдалося показати. Спробуйте оновити або поверніться на головну.
        </p>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            overflowX: "auto",
            background: "var(--talo-surface-2)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius)",
            fontSize: "var(--fs-sm)",
          }}
        >
          {String(error.message ?? error)}
        </pre>
        <p style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
          <button type="button" className="btn btn--primary" onClick={this.handleReset}>
            Спробувати ще раз
          </button>
          <Link to="/" className="btn btn--outline" onClick={this.handleReset}>
            На головну
          </Link>
        </p>
      </div>
    );
  }
}

export default ErrorBoundary;
