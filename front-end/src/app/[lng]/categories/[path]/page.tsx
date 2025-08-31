import { connection } from 'next/server';
import { cache } from 'react';

import { fetchCategories } from '@/entities/category/api';
import { fetchProductByCategory } from '@/entities/product/api';
import { CategoriesView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral } from '@i18n/utils';

const getProductsCached = cache(fetchProductByCategory);

export async function generateMetadata({ params }: { params: Promise<{ lng: string; path: string }> }) {
  const { lng, path } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const products = await getProductsCached(path, lng);
  const category = products.length ? products[0].category : null;
  const keywords = category?.keywords
    ? Array.from(
        new Set(
          category.keywords
            .split(/\r?\n|,/)
            .map(s => s.trim())
            .filter(Boolean),
        ),
      )
    : products.slice(0, 30).map(p => p.title);

  return generateMetadataGeneral(lng, {
    keywordsKeys: keywords,
    titleKey: products[0]?.category?.title,
  });
}

export default async function Page({ params }: { params: Promise<{ lng: string; path: string }> }) {
  let { lng, path } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  await connection();
  const categories = await fetchCategories(lng);

  const products = await getProductsCached(path, lng);

  return <CategoriesView lng={lng} products={products} categories={categories} category={path} />;
}
