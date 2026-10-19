import { ICatalogProduct, IProductResponse } from './types';

// Cards show the first 150 characters of the description as text; keep some margin for HTML entities.
const DESCRIPTION_PREVIEW_LENGTH = 300;

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Trims a product to the fields a catalog card renders. Full products carry description,
 * characteristics and both languages; serializing a whole category of them into the page
 * made the Next.js server run out of memory.
 */
export const toCatalogProduct = (product: IProductResponse): ICatalogProduct => ({
  id: product.id,
  title: product.title,
  title_ru: product.title_ru,
  images: product.images?.slice(0, 1),
  description: product.description ? stripHtml(product.description).slice(0, DESCRIPTION_PREVIEW_LENGTH) : undefined,
  subCategory: product.subCategory ? { path: product.subCategory.path } : undefined,
});
