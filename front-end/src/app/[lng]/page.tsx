import { connection } from 'next/server';
import { cache } from 'react';

import { fetchCategories } from '@/entities/category/api';
import { fetchLastAddedProducts, fetchProductsOffSet } from '@/entities/product/api';
import { MainView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral } from '@i18n/utils';

const getCategoriesCached = cache(fetchCategories);

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const categories = await getCategoriesCached();

  return generateMetadataGeneral(lng, { keywordsKeys: categories.map(item => item.name) });
}

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  await connection();
  const categories = await getCategoriesCached();

  const products = await fetchProductsOffSet('', 1, 12, true);
  const lastAddedProducts = await fetchLastAddedProducts();

  console.log('data', categories, products, lastAddedProducts);

  return (
    <MainView
      lng={lng}
      products={products.products}
      categories={categories}
      lastAddedProducts={lastAddedProducts}
      totalPages={products.totalPages}

    />
  );
}
