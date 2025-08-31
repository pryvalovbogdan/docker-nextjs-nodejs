import { redirect } from 'next/navigation';
import { cache } from 'react';

import { fetchProductById } from '@/entities/product/api';
import { ProductView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

const getProductsByIdCached = cache(fetchProductById);

export { generateStaticParams };
export async function generateMetadata({ params }: { params: Promise<{ lng: string; id: string }> }) {
  const { id, lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const product = await getProductsByIdCached(id, lng);

  return generateMetadataGeneral(lng, {
    titleKey: product.title,
    descriptionKey: product.description || '',
    keywordsKeys: [product.brand || '', product.title, product.category?.name || ''],
  });
}

export default async function Page({ params }: { params: Promise<{ lng: string; id: string }> }) {
  let { lng, id } = await params;

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const product = await getProductsByIdCached(id, lng);

  if (product.error) {
    redirect(`/${lng}`);
  }

  return (
    <ProductView
      product={product}
      lng={lng}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
      origin={process.env.NEXT_PUBLIC_DOMAIN_URL}
    />
  );
}
