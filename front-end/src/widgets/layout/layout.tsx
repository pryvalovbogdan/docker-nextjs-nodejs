'use client';

import React from 'react';

import { ICategoryResponse } from '@/entities/category/model/types';
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
}> = ({ children, lng, officePhone, officePhoneSecond, officeEmail, categories }) => {
  return (
    <Box minH='100vh' display='flex' flexDirection='column' color='black' bg='#F7FCFD' id='layout'>
      <GoogleAnalytics gaId='G-N027DVBJZZ' />
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
