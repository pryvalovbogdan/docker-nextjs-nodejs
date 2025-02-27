'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';

import SearchBar from '@/features/search/search-bar/search-bar';
import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const Header: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const links = [
    { name: t('links.home'), url: `/${lng}`, id: 'layout' },
    { name: t('links.brands'), url: `/${lng}#brands`, id: 'brands' },
    { name: t('links.categories'), url: `/${lng}#categories`, id: 'categories' },
    { name: t('links.contact'), url: `/${lng}/contacts`, id: '' },
    { name: t('links.aboutUs'), url: `/${lng}/about`, id: '' },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      const offsetTop = section.getBoundingClientRect().top + window.scrollY - 70;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }

    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isMenuOpen]);

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
      <Flex maxW='container.xl' mx='auto' justify='space-between' align='center' px={4}>
        <Heading as='h1' size='lg'>
          {t('titleHeader')}
        </Heading>

        <Box flex='1' mx={6} maxW={{ base: '80%', md: '300px' }}>
          <SearchBar lng={lng} />
        </Box>

        <Flex flex={1} justify='space-around' display={{ base: 'none', md: 'flex' }}>
          {links.map(item =>
            pathname === `/${lng}` && item.id ? (
              <Text
                key={item.id}
                _hover={{ textDecoration: 'underline' }}
                color='rgba(6, 33, 38, 0.60)'
                onClick={() => scrollToSection(item.id)}
                cursor='pointer'
              >
                {item.name}
              </Text>
            ) : (
              <Link
                as={NextLink}
                key={item.url}
                href={item.url}
                _hover={{ textDecoration: 'underline' }}
                color='rgba(6, 33, 38, 0.60)'
              >
                {item.name}
              </Link>
            ),
          )}
        </Flex>

        <IconButton
          aria-label='Open Menu'
          variant='ghost'
          display={{ base: 'block', md: 'none' }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </IconButton>
      </Flex>

      <Box
        ref={menuRef}
        width='100%'
        overflow='hidden'
        transition='max-height 0.3s ease-in-out'
        maxHeight={menuHeight ? `${menuHeight}px` : '0px'}
        px={4}
        py={isMenuOpen ? 2 : 0}
      >
        <Flex flexDirection='column' align='center' gap={3} mt={3}>
          {links.map(item =>
            pathname === `/${lng}` && item.id ? (
              <Text
                key={item.id}
                fontSize='lg'
                fontWeight='bold'
                _hover={{ textDecoration: 'underline' }}
                color='rgba(6, 33, 38, 0.80)'
                onClick={() => scrollToSection(item.id)}
                cursor='pointer'
              >
                {item.name}
              </Text>
            ) : (
              <Link
                as={NextLink}
                key={item.url}
                href={item.url}
                fontSize='lg'
                fontWeight='bold'
                _hover={{ textDecoration: 'underline' }}
                color='rgba(6, 33, 38, 0.80)'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ),
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
