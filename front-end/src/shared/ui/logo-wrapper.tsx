import localFont from 'next/font/local';
import React from 'react';

import { Flex, Image, Text } from '@chakra-ui/react';

const logoFont = localFont({
  src: '../../../public/fonts/EazyChat.ttf',
});
const LogoWrapper = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Flex alignItems='center' justifyContent='center' gap={1} cursor='pointer' onClick={onClick}>
      <Image
        mb={2}
        src='/logo.svg'
        alt='Madix'
        h='42px'
        borderRadius='lg'
        boxShadow='md'
        color='red'
        bg='#3E5A6F'
        p={2}
      />
      <Text
        fontSize={{ base: '4xl', md: '4xl' }}
        fontWeight='bold'
        color='#001489'
        textShadow='2px 4px 6px rgba(0, 0, 0, 0.3)'
        className={logoFont.className}
        textAlign='center'
      >
        Med
        <Text as='span' position='relative'>
          <Text as='span' color='#001489'>
            i
          </Text>
          <Text as='span' color='#D94F2B' position='absolute' top='-19px' left='-1px' fontSize='1em'>
            •
          </Text>
        </Text>
        x
      </Text>
    </Flex>
  );
};

export default LogoWrapper;
