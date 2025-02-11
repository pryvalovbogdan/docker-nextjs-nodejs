'use client';

import React from 'react';

import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const Header: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng);

  const links = [
    { name: t('links.home'), url: `/${lng}` },
    { name: t('links.brands'), url: `/${lng}#brands` },
    { name: t('links.categories'), url: `/${lng}/categories` },
    { name: t('links.contact'), url: `/${lng}#contact` },
  ];

  return (
    <Box
      as='header'
      position='sticky'
      top='0'
      zIndex='1000'
      bg='rgba(15, 151, 181, 0.04)'
      backdropFilter='blur(20px)'
      width='100%'
      py={4}
      color='black'
    >
      <Flex maxW='container.xl' mx='auto' justify='space-between' align='center'>
        <Heading as='h1' size='lg' ml={4}>
          {t('titleHeader')}
        </Heading>
        <Flex flex={1} justify='space-around'>
          {links.map(item => (
            <Text key={item.url}>
              <Link href={item.url} _hover={{ textDecoration: 'underline' }} color='rgba(6, 33, 38, 0.60)'>
                {item.name}
              </Link>
            </Text>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
