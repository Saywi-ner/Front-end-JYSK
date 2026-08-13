// src/components/RemoteImage.jsx
// Картинка з зовнішнього джерела (Unsplash) з підстраховкою.
//
// Посилання на чужий CDN рано чи пізно протухають: три фото з початкового
// сіда вже віддавали 404, і на їх місці браузер малював іконку «битого
// зображення». Тут будь-яка помилка завантаження перемикає нас на текстовий
// плейсхолдер — сторінка лишається охайною.
//
// Стан тримаємо як «яка саме адреса впала», а не булевим прапорцем: інакше
// після зміни src (перемикання фото в галереї) компонент показував би
// плейсхолдер для вже справної картинки.

import { useState } from "react";

const RemoteImage = ({
  src,
  alt = "",
  className,
  placeholderClassName,
  placeholder = "TALO",
  ...imgProps
}) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <span className={placeholderClassName} aria-hidden="true">
        {placeholder}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      {...imgProps}
    />
  );
};

export default RemoteImage;
