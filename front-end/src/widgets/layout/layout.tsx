'use client';

import React from 'react';

import type { ICategoryResponse } from '@/entities/category/model/types';
import { GlobalStructuredData } from '@/shared/ui';
import { Box } from '@chakra-ui/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from '@widgets/footer/footer';
import Header from '@widgets/header/header';

const Layout: React.FC<{
  children: React.ReactNode;
  lng: string;
  officePhoneSecond?: string;
  officePhone?: string;
  officeEmail?: string;
  categories?: ICategoryResponse[];
  origin?: string;
}> = ({ children, lng, officePhone, officePhoneSecond, officeEmail, categories, origin }) => {
  return (
    <Box
      minH='100vh'
      display='flex'
      flexDirection='column'
      color='black'
      bg='#F7FCFD'
      _dark={{ color: 'gray.100', bg: 'gray.900' }}
      transition='background-color 0.3s ease, color 0.3s ease'
      id='layout'
    >
      <GoogleAnalytics gaId='G-N027DVBJZZ' />
      <GlobalStructuredData
        origin={origin}
        officePhone={officePhone}
        officePhoneSecond={officePhoneSecond}
        officeEmail={officeEmail}
      />
      <Header lng={lng} officePhoneSecond={officePhoneSecond || ''} officePhone={officePhone || ''} />
      <Box as='main' flex='1'>
        {children}
      </Box>
      <Footer
        lng={lng}
        officePhoneSecond={officePhoneSecond}
        officePhone={officePhone}
        officeEmail={officeEmail}
        categoriesProp={categories}
      />
    </Box>
  );
};

export default Layout;
