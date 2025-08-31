import { fetchCategoryByPath, fetchProductByCategory } from '@/entities/product/api';
import { CategoryView } from '@/views';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string; path: string }> }) {
  const { path, lng } = await params;

  const products = await fetchProductByCategory(path);
  const category = products.length ? products[0].category : null;
  const keywords = category?.keywords
    ? Array.from(
        new Set(
          category.keywords
            .split(/\r?\n|,/)
            .map(s => s.trim())
            .filter(Boolean),
        ),
      )
    : products.map(p => p.title);

  return generateMetadataGeneral(lng, {
    titleKey: products.length ? products[0].category.name : '',
    keywordsKeys: keywords,
  });
}

export default async function Page({ params }: { params: Promise<{ lng: string; path: string }> }) {
  let { lng, path } = await params;

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const products = await fetchProductByCategory(path, {
    next: { revalidate: 60 },
  });

  const category = await fetchCategoryByPath(path, {
    next: { revalidate: 60 },
  });

  return (
    <CategoryView
      products={products}
      lng={lng}
      query={lng === 'ru' ? category.name_ru : category.name}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
      origin={process.env.NEXT_PUBLIC_DOMAIN_URL}
    />
  );
}
