'use client';

import React from 'react';

import { Box } from '@chakra-ui/react';
import Footer from '@widgets/footer/footer';
import Header from '@widgets/header/header';

const Layout: React.FC<{
  children: React.ReactNode;
  lng: string;
  officePhoneSecond?: string;
  officePhone?: string;
  officeEmail?: string;
}> = ({ children, lng, officePhone, officePhoneSecond, officeEmail }) => {
  return (
    <Box minH='100vh' display='flex' flexDirection='column' color='black' bg='#F7FCFD' id='layout'>
      <Header lng={lng} officePhoneSecond={officePhoneSecond || ''} officePhone={officePhone || ''} />
      <Box as='main' flex='1'>
        {children}
      </Box>
      <Footer lng={lng} officePhoneSecond={officePhoneSecond} officePhone={officePhone} officeEmail={officeEmail} />
    </Box>
  );
};

export default Layout;
