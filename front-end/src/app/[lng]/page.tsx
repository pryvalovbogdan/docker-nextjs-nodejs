import { Advent_Pro } from 'next/font/google';

import { Box, Button, Heading, Text } from '@chakra-ui/react';
import ImageSendForm from '@components/ImageSendForm';
import LanguageSwitcher from '@components/LanguageSwitcher';
import MainLayout from '@components/MainLayout';
import BrandsSection from '@components/sections/BrandSection';
import CategoriesSection from '@components/sections/CategoriesSections';
import ContactSection from '@components/sections/ContactSections';
import ProductsSection from '@components/sections/ProductsSections';
import TopSalesSection from '@components/sections/TopSales';
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
      {/*<CategoriesSection />*/}
      {/*<TopSalesSection />*/}
      {/*<ProductsSection />*/}
      <ContactSection />
    </MainLayout>
  );
}
