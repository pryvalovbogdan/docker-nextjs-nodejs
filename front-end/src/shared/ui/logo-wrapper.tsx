import localFont from 'next/font/local';
import React from 'react';

import { Flex, Image, Text } from '@chakra-ui/react';

const logoFont = localFont({
  src: '../../../public/fonts/EazyChat.ttf',
});
const LogoWrapper = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Flex alignItems='center' justifyContent='center' cursor='pointer' onClick={onClick}>
      <Image src='/logo.svg' alt='Madix' h='51px' w='51px' color='red' />
      <Text
        fontSize={{ base: '4xl', md: '4xl' }}
        fontWeight='bold'
        color='white'
        textShadow='2px 4px 6px rgba(0, 0, 0, 0.3)'
        className={logoFont.className}
        textAlign='center'
      >
        edix
      </Text>
    </Flex>
  );
};

export default LogoWrapper;
