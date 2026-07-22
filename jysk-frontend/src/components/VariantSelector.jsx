// src/components/VariantSelector.jsx
// Вибір варіанту товару (розмір/колір) — кнопки, не текст.
// variants: [{ id, label, color, size, price, stock }]

import { formatPrice } from "../utils/format";
import "./VariantSelector.css";

const VariantSelector = ({ variants, selectedId, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="variant-selector">
      <span className="variant-selector__label">Варіант:</span>
      <div className="variant-selector__options" role="group" aria-label="Варіанти товару">
        {variants.map((v) => {
          const out = v.stock === 0;
          const active = selectedId === v.id;
          const title = v.label || [v.size, v.color].filter(Boolean).join(" · ") || "Варіант";
          return (
            <button
              key={v.id}
              type="button"
              className={
                "variant-selector__option" +
                (active ? " variant-selector__option--active" : "") +
                (out ? " variant-selector__option--out" : "")
              }
              disabled={out}
              aria-pressed={active}
              onClick={() => onSelect(v.id)}
            >
              <span className="variant-selector__name">{title}</span>
              <span className="variant-selector__price">{formatPrice(v.price)}</span>
              {out && <span className="variant-selector__badge">немає</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
