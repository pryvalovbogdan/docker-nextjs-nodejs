import { fetchProductByCategory } from '@/entities/product/api';
import { CategoryView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string; name: string }> }) {
  const { name, lng } = await params;

  const decodedName = decodeURIComponent(name);

  const products = await fetchProductByCategory(decodedName);

  return generateMetadataGeneral(lng, {
    titleKey: decodedName,
    keywordsKeys: products.map(item => item.title),
  });
}

export default async function Page({ params }: { params: Promise<{ lng: string; name: string }> }) {
  let { lng, name } = await params;

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const decodedName = decodeURIComponent(name);

  const products = await fetchProductByCategory(decodedName);

  return (
    <CategoryView
      products={products}
      lng={lng}
      query={decodedName}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
    />
  );
}
