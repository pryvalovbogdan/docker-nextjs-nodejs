import { fetchBrandProducts } from '@/entities/product/api';
import { ProductsBrandView } from '@/views';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string; name: string }> }) {
  const { name, lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const products = await fetchBrandProducts(name);

  const keys = products.map(product => product.title);

  return generateMetadataGeneral(lng, { keywordsKeys: keys, titleKey: name });
}

export default async function Page({ params }: { params: Promise<{ name: string; lng: string }> }) {
  const { name, lng } = await params;

  const products = await fetchBrandProducts(name);

  return <ProductsBrandView products={products} brandName={name} lng={lng} />;
}
