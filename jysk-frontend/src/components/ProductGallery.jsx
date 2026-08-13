// src/components/ProductGallery.jsx
// Галерея товару: головне фото + мініатюри.
// images: [{ id, imageUrl, isMain }]

import { useState } from "react";
import RemoteImage from "./RemoteImage";
import "./ProductGallery.css";

const ProductGallery = ({ images = [], name }) => {
  const ordered = [...images].sort((a, b) => Number(b.isMain) - Number(a.isMain));
  const [active, setActive] = useState(0);

  if (ordered.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery__main gallery__main--empty">
          <span className="gallery__placeholder">TALO</span>
        </div>
      </div>
    );
  }

  const current = ordered[active] ?? ordered[0];

  return (
    <div className="gallery">
      <div className="gallery__main">
        <RemoteImage
          src={current.imageUrl}
          alt={name}
          loading="eager"
          placeholderClassName="gallery__placeholder"
        />
      </div>

      {ordered.length > 1 && (
        <ul className="gallery__thumbs">
          {ordered.map((img, i) => (
            <li key={img.id ?? i}>
              <button
                type="button"
                className={"gallery__thumb" + (i === active ? " gallery__thumb--active" : "")}
                onClick={() => setActive(i)}
                aria-label={`Фото ${i + 1}`}
                aria-pressed={i === active}
              >
                <RemoteImage src={img.imageUrl} placeholderClassName="gallery__placeholder" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductGallery;
