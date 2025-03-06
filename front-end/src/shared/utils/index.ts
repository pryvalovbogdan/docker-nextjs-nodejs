'use client';

export const getInnerText = (html: string) => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return doc.body.textContent || '';
};
