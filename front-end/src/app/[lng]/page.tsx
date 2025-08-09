import { connection } from 'next/server';
import { cache } from 'react';

import { fetchCategories } from '@/entities/category/api';
import { fetchLastAddedProducts, fetchProductsOffSet } from '@/entities/product/api';
import LastAddedProducts from '@/entities/product/ui/last-added-products';
import { BrandsCarousel, Catalog, GalleryImages, Layout, WhyUs } from '@/widgets';
import { ContactButton, ContactForm } from '@features/contact';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral } from '@i18n/utils';

export const getCategoriesCached = cache(fetchCategories);
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

  return (
    <Layout
      lng={lng}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND!}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE!}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL!}
    >
      <GalleryImages lng={lng} />
      <Catalog
        lng={lng}
        products={{ data: products.products, totalPages: products.totalPages }}
        categories={categories}
      />
      <BrandsCarousel lng={lng} />
      <LastAddedProducts products={lastAddedProducts} lng={lng} />
      <WhyUs lng={lng} withHeading />
      <ContactForm lng={lng} withMargin />
      <ContactButton lng={lng} />
    </Layout>
  );
}
