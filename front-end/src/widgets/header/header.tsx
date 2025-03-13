'use client';

import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';

import SearchBar from '@/features/search/search-bar/search-bar';
import LogoWrapper from '@/shared/ui/logo-wrapper';
import { Box, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const Header: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng);
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const links = [
    { name: t('links.home'), url: `/${lng}`, id: 'layout' },
    { name: t('links.brands'), url: `/${lng}/brand`, id: '' },
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
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <Box
      as='header'
      position='sticky'
      top='0'
      zIndex='1000'
      bg='rgba(3, 103, 83, 0.8)'
      backdropFilter='blur(12px)'
      boxShadow='md'
      width='100%'
      py={4}
      color='white'
    >
      <Flex maxW='container.xl' mx='auto' justify='space-between' alignItems='center' px={4}>
        <LogoWrapper onClick={() => (pathname === `/${lng}` ? scrollToSection('layout') : router.push(`/${lng}`))} />

        <Box flex='1' mx={6} maxW={{ base: '80%', md: '300px' }}>
          <SearchBar lng={lng} />
        </Box>

        <Flex flex={1} justify='space-around' display={{ base: 'none', md: 'flex' }}>
          {links.map(item =>
            pathname === `/${lng}` && item.id ? (
              <Text
                key={item.id}
                _hover={{ color: '#F2F2F2', textDecoration: 'underline' }}
                color='white'
                onClick={() => scrollToSection(item.id)}
                cursor='pointer'
                transition='color 0.2s'
              >
                {item.name}
              </Text>
            ) : (
              <Link
                as={NextLink}
                key={item.url}
                href={item.url}
                _hover={{ color: '#F2F2F2', textDecoration: 'underline' }}
                color='white'
                transition='color 0.2s'
              >
                {item.name}
              </Link>
            ),
          )}
        </Flex>

        <IconButton
          aria-label='Open Menu'
          variant='ghost'
          color='white'
          display={{ base: 'block', md: 'none' }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          transition='all 0.2s'
          _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
        >
          {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </IconButton>
      </Flex>

      {isMenuOpen && (
        <Box
          ref={menuRef}
          position='absolute'
          top='100%'
          left='0'
          width='100%'
          bg='rgba(255, 255, 255, 0.95)'
          backdropFilter='blur(10px)'
          boxShadow='xl'
          py={4}
          zIndex='1001'
        >
          <Flex flexDirection='column' align='center' gap={4}>
            {links.map(item =>
              pathname === `/${lng}` && item.id ? (
                <Text
                  key={item.id}
                  fontSize='lg'
                  fontWeight='bold'
                  _hover={{ color: '#036753', textDecoration: 'underline' }}
                  color='gray.800'
                  onClick={() => scrollToSection(item.id)}
                  cursor='pointer'
                  transition='color 0.2s'
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
                  _hover={{ color: '#036753', textDecoration: 'underline' }}
                  color='gray.800'
                  transition='color 0.2s'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Header;
