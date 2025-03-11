import { connection } from 'next/server';

import { fetchCategories } from '@/entities/category/api';
import { fetchLastAddedProducts, fetchProductByCategory } from '@/entities/product/api';
import LastAddedProducts from '@/entities/product/ui/last-added-products';
import BrandsSection from '@/views/brand-section';
import ContactForm from '@features/contact/send-request/contact-form';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral } from '@i18n/utils';
import { ContactButton } from '@widgets/contact';
import { GalleryImages } from '@widgets/gallary-images';
import { Gallery } from '@widgets/gallery';
import { Layout } from '@widgets/layout';
import { WhyUs } from '@widgets/why-us';

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const categories = await fetchCategories();

  return generateMetadataGeneral(lng, { keywordsKeys: categories.map(item => item.name) });
}

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  await connection();
  const categories = await fetchCategories();
  const products = await fetchProductByCategory(categories[0]?.name || '');
  const lastAddedProducts = await fetchLastAddedProducts();

  return (
    <Layout
      lng={lng}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
    >
      <GalleryImages lng={lng} />
      <Gallery lng={lng} products={products} categories={categories} />
      <BrandsSection lng={lng} />
      <LastAddedProducts products={lastAddedProducts} lng={lng} />
      <WhyUs lng={lng} withHeading />
      <ContactForm lng={lng} withMargin />
      <ContactButton lng={lng} />
    </Layout>
  );
}
