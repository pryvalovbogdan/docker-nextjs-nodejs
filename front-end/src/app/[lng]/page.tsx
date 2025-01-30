import MainLayout from '@components/MainLayout';
import BrandsSection from '@components/sections/BrandSection';
import ContactSection from '@components/sections/ContactSections';
import { fallbackLng, languages } from '@i18n/settings';

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  return (
    <MainLayout>
      <BrandsSection lng={lng} />
      {/* <CategoriesSection /> */}
      {/* <TopSalesSection /> */}
      {/* <ProductsSection /> */}
      <ContactSection lng={lng} />
    </MainLayout>
  );
}
