'use client';

export const getInnerText = (html: string) => {
  if (!html) return '';

  if (typeof window !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc.body.textContent || '';
  }

  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const sanitizeHTML = (html: string) => {
  return html.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
};

export const processDescriptionGeo = (description: string) => {
  const geoDescrRegex = /<div\s+class=["']geo-descr["'][^>]*>/i;

  if (!geoDescrRegex.test(description)) {
    return description;
  }

  const geoDescrMatch = description.match(/<div\s+class=["']geo-descr["'][^>]*>([\s\S]*?)<\/div>/i);

  if (!geoDescrMatch) {
    return description;
  }

  let geoDescrContent = geoDescrMatch[1];

  let optionsTitle = '';

  geoDescrContent = geoDescrContent.replace(/Опції:/i, () => {
    optionsTitle = '<p><strong>Опції:</strong></p>';

    return '';
  });

  const firstLineMatch = geoDescrContent.match(/^([\p{Lu}\s-]+)/u);

  let shouldShowGeoChar = false;

  if (geoDescrMatch) {
    const geoDescrContent = geoDescrMatch[1].trim();

    if (!geoDescrContent) {
      shouldShowGeoChar = true;
    }
  }

  let extraStyles = '';

  if (shouldShowGeoChar) {
    extraStyles = `
      <style>
        .geo-char {
          display: block !important;
        }
      </style>
    `;

    return `${extraStyles}${description}`;
  }

  if (firstLineMatch && !description.match(/Опції:/i)) {
    const firstLine = firstLineMatch[1].trim();

    geoDescrContent = geoDescrContent.replace(firstLine, `<strong>${firstLine}</strong>`);

    return description.replace(geoDescrMatch[1], geoDescrContent);
  }

  const listItems = geoDescrContent
    .split(',')
    .map(item => `<li>${item.trim()}</li>`)
    .join('');

  geoDescrContent = `${optionsTitle}<ul>${listItems}</ul>`;

  return description.replace(geoDescrMatch[1], geoDescrContent);
};

export const getIsShownDescription = (description: string) => {
  const geoDescrMatch = description?.match(/<div\s+class=["']geo-descr["'][^>]*>([\s\S]*?)<\/div>/i);
  const geoCharMatch = description?.match(/<div\s+class=["']geo-char["'][^>]*>([\s\S]*?)<\/div>/i);

  const geoDescrContent = geoDescrMatch ? geoDescrMatch[1].trim() : '';
  const geoCharContent = geoCharMatch ? geoCharMatch[1].trim() : '';

  return geoDescrMatch ? !(!geoDescrContent && !geoCharContent) : true;
};

export const hasValidContent = (htmlString: string | undefined) => {
  if (!htmlString) return false;

  const div = document.createElement('div');

  div.innerHTML = htmlString;

  return div.innerText.trim().length > 0;
};
