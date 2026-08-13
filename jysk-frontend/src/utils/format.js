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

// Універсальний доступ до головного фото. Бек віддає mainImageUrl у списках,
// images[] у деталці, а для товару без фото — нічого: тоді картка показує
// власний плейсхолдер замість «битої» картинки.
export const productImage = (product) => {
  const url =
    product?.mainImageUrl ||
    product?.imageUrl ||
    product?.images?.find((i) => i.isMain)?.imageUrl ||
    product?.images?.[0]?.imageUrl ||
    null;

  if (!url) return null;
  // Старий сід записував рядок-заглушку у поле URL.
  return url === "placeholder.jpg" ? null : url;
};

// Дата у вигляді «11.08.2026». Некоректну дату не показуємо зовсім.
export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("uk-UA");
};
