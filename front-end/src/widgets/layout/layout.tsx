'use client';

import React from 'react';

import Footer from '@widgets/footer/footer';
import Header from '@widgets/header/header';
import { Box } from '@chakra-ui/react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box minH='100vh' display='flex' flexDirection='column' color='black' bg='#F7FCFD'>
      <Header />
      <Box as='main' flex='1' py={8} px={4}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
