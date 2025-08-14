import { connection } from 'next/server';
import { cache } from 'react';

import { fetchCategories } from '@/entities/category/api';
import { fetchLastAddedProducts, fetchProductByCategory } from '@/entities/product/api';
import { MainView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral } from '@i18n/utils';

const getProductsCached = cache(fetchProductByCategory);

export async function generateMetadata({ params }: { params: Promise<{ lng: string; path: string }> }) {
  const { lng, path } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const products = await getProductsCached(path);

  console.log('products', products);

  return generateMetadataGeneral(lng, {
    keywordsKeys: products.slice(0, 30).map(item => item.title),
    titleKey: products[0]?.category?.name,
  });
}

export default async function Page({ params }: { params: Promise<{ lng: string; path: string }> }) {
  let { lng, path } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  await connection();
  const categories = await fetchCategories();

  const products = await getProductsCached(path);
  const lastAddedProducts = await fetchLastAddedProducts();

  return (
    <MainView
      lng={lng}
      products={products}
      categories={categories}
      lastAddedProducts={lastAddedProducts}
      category={path}
    />
  );
}
