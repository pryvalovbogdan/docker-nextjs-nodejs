'use client';

import { useRouter } from 'next/navigation';
import React, { ElementType, useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';

import { fetchCategories } from '@/entities/category/api';
import { ICategoryResponse } from '@/entities/category/model/types';
import { Box, Flex, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const Footer = ({
  lng,
  officePhone,
  officePhoneSecond,
  officeEmail,
  categoriesProp,
}: {
  lng: string;
  officePhoneSecond?: string;
  officePhone?: string;
  officeEmail?: string;
  categoriesProp?: ICategoryResponse[];
}) => {
  const { t } = useTranslation(lng);
  const [categories, setCategories] = useState<ICategoryResponse[]>(categoriesProp || []);
  const router = useRouter();

  const didFetch = React.useRef(false);

  useEffect(() => {
    if (didFetch.current || categoriesProp?.length) return;

    didFetch.current = true;

    fetchCategories(true).then(setCategories).catch(console.error);
  }, []);

  return (
    <Box as='footer' bg='black' p={8} color='white'>
      <Flex justify='space-between' flexWrap='wrap' maxW='1200px' mx='auto'>
        <VStack align='start' flex='1'>
          <Text fontWeight='bold'>{t('aboutCompany')}</Text>
          <Link href={`/${lng}/about`} color='gray.400' _hover={{ textDecoration: 'underline', color: 'gray.200' }}>
            {t('aboutUs')}
          </Link>
          <Link href={`/${lng}/brand`} color='gray.400' _hover={{ textDecoration: 'underline', color: 'gray.200' }}>
            {t('brands')}
          </Link>
        </VStack>

        <VStack align='start' flex='1'>
          <Text fontWeight='bold'>{t('customers')}</Text>
          <Link href={`/${lng}/contacts`} color='gray.400' _hover={{ textDecoration: 'underline', color: 'gray.200' }}>
            {t('contacts')}
          </Link>
        </VStack>

        <VStack align='start' flex='1'>
          <Text fontWeight='bold'>{t('categories')}</Text>
          {categories.map(item => (
            <Text
              key={item.name + item.path}
              onClick={() => router.push(`/${lng}/category/${item.path}`)}
              color='gray.400'
              cursor='pointer'
              transition='color 0.2s'
              _hover={{ textDecoration: 'underline', color: 'gray.200' }}
            >
              {item.name}
            </Text>
          ))}
        </VStack>

        <VStack align='start' flex='1'>
          <Text fontWeight='bold'>{t('contacts')}</Text>
          <Flex align='start' flexDirection='column'>
            <Flex>
              <Icon as={MdPhone as ElementType} boxSize={5} color='gray.400' mr={2} />
              <Text fontWeight='bold'>{t('phone')}</Text>
            </Flex>

            <Flex flexDirection='column'>
              <Link href={`tel:${officePhone}`} color='gray.400' _hover={{ color: 'gray.200' }}>
                {officePhone}
              </Link>
              <Link href={`tel:${officePhoneSecond}`} color='gray.400' _hover={{ color: 'gray.200' }}>
                {officePhoneSecond}
              </Link>
            </Flex>
          </Flex>

          <Flex align='center'>
            <Icon as={MdEmail as ElementType} boxSize={5} color='gray.400' mr={2} />
            <Text fontWeight='bold'>{t('email')}</Text>
          </Flex>

          <Link href={`mailto:${officeEmail}`} color='gray.400' _hover={{ color: 'gray.200' }}>
            {officeEmail}
          </Link>
          <Text fontWeight='bold'>{t('weInSocials')}</Text>
          <Flex align='center' gap={4}>
            <Link href='https://www.instagram.com/medix_._?igsh=em04dnVtM2JpNTM0' target='_blank'>
              <Icon
                as={FaInstagram as ElementType}
                boxSize={5}
                color='white'
                cursor='pointer'
                _hover={{ color: 'gray.200' }}
              />
            </Link>
            <Link href='https://www.facebook.com/share/1B9zftHSpp/?mibextid=wwXIfr' target='_blank'>
              <Icon
                as={FaFacebook as ElementType}
                boxSize={5}
                color='white'
                cursor='pointer'
                _hover={{ color: 'gray.200' }}
              />
            </Link>
            <Link href={`https://t.me/${officePhone?.replace(/[^+\d]/g, '')}`} target='_blank'>
              <Icon
                as={FaTelegram as ElementType}
                boxSize={5}
                color='white'
                cursor='pointer'
                _hover={{ color: 'gray.200' }}
              />
            </Link>
          </Flex>
          <Text fontWeight='bold'>{t('workHours')}</Text>
          <Text color='gray.400'>{t('alwaysOpen')}</Text>
        </VStack>
      </Flex>

      <Box borderBottom='1px solid gray' my={6} opacity={0.3} />

      <Flex justify='space-between' align='center' w='100%'>
        <Flex justifyContent='space-between' align='center' w='100%'>
          <Text fontSize='sm' color='gray.400'>
            {t('copyright')}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
