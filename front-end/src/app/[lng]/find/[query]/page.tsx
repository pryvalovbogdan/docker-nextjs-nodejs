import { fetchSearchProducts } from '@/entities/product/api';
import { SearchView } from '@/views';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string; query: string }> }) {
  const { query, lng } = await params;

  // Request cached with force cache - https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
  const products = await fetchSearchProducts(query, true);

  const keys = products.map(product => product.title);

  return generateMetadataGeneral(lng, { keywordsKeys: keys, titleKey: query });
}

export default async function Page({ params }: { params: Promise<{ query: string; lng: string }> }) {
  const { query, lng } = await params;

  const products = await fetchSearchProducts(query, true);

  return (
    <SearchView
      products={products}
      query={query}
      lng={lng}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
    />
  );
}
