// src/utils/format.js
// Форматування ціни у гривнях: 1990 -> "1 990 грн".

export const formatPrice = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "";
  const n = Number(value);
  const grouped = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return grouped + " грн";
};

// Відсоток знижки за старою/новою ціною: 2500 -> 1990 дає "-20%".
export const discountPercent = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return null;
  return "-" + Math.round((1 - price / oldPrice) * 100) + "%";
};

// Універсальний доступ до головного фото (бек віддає mainImageUrl або imageUrl).
export const productImage = (product) =>
  product?.mainImageUrl || product?.imageUrl || null;
