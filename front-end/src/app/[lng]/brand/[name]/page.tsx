import { fetchBrandProducts } from '@/entities/product/api';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';
import { Layout } from '@widgets/layout';
import { BrandProducts } from '@widgets/prducts-by-brand-list/index';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string; name: string }> }) {
  const { name, lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const products = await fetchBrandProducts(name);

  const keys = [];

  for (const product of products) {
    keys.push(product.title);
  }

  return generateMetadataGeneral(lng, { keywordsKeys: keys, titleKey: name });
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const products = await fetchBrandProducts(name);

  return (
    <Layout>
      <BrandProducts products={products} brandName={name} />
    </Layout>
  );
}
