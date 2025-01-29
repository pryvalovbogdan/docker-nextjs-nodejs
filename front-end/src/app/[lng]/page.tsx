import { Advent_Pro } from 'next/font/google';

import ImageSendForm from '@components/ImageSendForm';
import MainLayout from '@components/MainLayout';
import BrandsSection from '@components/sections/BrandSection';
import ContactSection from '@components/sections/ContactSections';
import { fallbackLng, languages } from '@i18n/settings';

const font = Advent_Pro({ subsets: ['latin'], variable: '--font-advent-pro' });

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
      <BrandsSection />
      {/* <CategoriesSection /> */}
      {/* <TopSalesSection /> */}
      {/* <ProductsSection /> */}
      <ContactSection />
      <ImageSendForm />
    </MainLayout>
  );
}
