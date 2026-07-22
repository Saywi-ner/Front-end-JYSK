// src/pages/NotFoundPage.jsx

import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => (
  <div className="container not-found">
    <p className="not-found__code">404</p>
    <h1 className="not-found__title">Такої сторінки не існує</h1>
    <p className="not-found__text">Можливо, товар знято з продажу або адресу введено з помилкою.</p>
    <Link to="/" className="btn btn--primary">На головну</Link>
  </div>
);

export default NotFoundPage;
