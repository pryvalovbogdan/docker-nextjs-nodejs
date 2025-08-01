import { fetchProductByCategory } from '@/entities/product/api';
import { CategoryView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string; path: string }> }) {
  const { path, lng } = await params;

  const products = await fetchProductByCategory(path);

  return generateMetadataGeneral(lng, {
    titleKey: products.length ? products[0].category.name : '',
    keywordsKeys: products.map(item => item.title),
  });
}

export default async function Page({ params }: { params: Promise<{ lng: string; path: string }> }) {
  let { lng, path } = await params;

  console.log(' lng, name', lng, path);

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const products = await fetchProductByCategory(path, {
    next: { revalidate: 60 },
  });

  return (
    <CategoryView
      products={products}
      lng={lng}
      query={products.length ? products[0].category.name : ''}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
    />
  );
}
