// src/components/RatingStars.jsx
// Візуальний рейтинг зірками. rating: 0..5, count — кількість відгуків.

import { StarIcon } from "./icons";
import "./RatingStars.css";

const RatingStars = ({ rating = 0, count, size = 16, showCount = true }) => {
  const rounded = Math.round(rating);

  return (
    <span className="rating" title={`${rating.toFixed(1)} з 5`}>
      <span className="rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon
            key={n}
            width={size}
            height={size}
            filled={n <= rounded}
            className={n <= rounded ? "rating__star rating__star--on" : "rating__star"}
          />
        ))}
      </span>
      {showCount && (
        <span className="rating__count">
          {rating ? rating.toFixed(1) : "—"}
          {typeof count === "number" && ` (${count})`}
        </span>
      )}
      <span className="visually-hidden">
        Рейтинг {rating.toFixed(1)} з 5
        {typeof count === "number" && `, відгуків: ${count}`}
      </span>
    </span>
  );
};

export default RatingStars;
