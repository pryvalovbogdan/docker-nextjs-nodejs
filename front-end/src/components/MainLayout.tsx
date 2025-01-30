'use client';

import React from 'react';

import { Box } from '@chakra-ui/react';

import Footer from './Footer';
import Header from './Header';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export default MainLayout;
