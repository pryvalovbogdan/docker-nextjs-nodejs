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
