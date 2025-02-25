import { fetchCategories } from '@/entities/category/api';
import { fetchProductByCategory } from '@/entities/product/api';
import BrandsSection from '@/views/BrandSection';
import ContactForm from '@features/contact/send-request/contact-form';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral } from '@i18n/utils';
import { Gallery } from '@widgets/gallery';
import Layout from '@widgets/layout/layout';

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const categories = await fetchCategories();

  return generateMetadataGeneral(lng, { keywordsKeys: categories.map(item => item.name) });
}

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  const categories = await fetchCategories();
  const products = await fetchProductByCategory(categories[0].name);

  return (
    <Layout lng={lng}>
      <Gallery lng={lng} products={products} categories={categories} />
      <BrandsSection lng={lng} />
      <ContactForm lng={lng} />
    </Layout>
  );
}
