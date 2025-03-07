'use client';

import { useRouter } from 'next/navigation';
import React, { ElementType, useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTelegram, FaYoutube } from 'react-icons/fa';
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
}: {
  lng: string;
  officePhoneSecond?: string;
  officePhone?: string;
  officeEmail?: string;
}) => {
  const { t } = useTranslation(lng);
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCategories(true)
      .then(res => setCategories(res))
      .catch(e => console.error(e));
  }, []);

  return (
    <Box as='footer' bg='black' p={8} color='white'>
      <Flex justify='space-between' flexWrap='wrap' maxW='1200px' mx='auto'>
        <VStack align='start' flex='1'>
          <Text fontWeight='bold'>{t('aboutCompany')}</Text>
          <Link href={`/${lng}/about`} color='gray.400' _hover={{ textDecoration: 'underline', color: 'gray.200' }}>
            {t('aboutUs')}
          </Link>
          <Link href={`/${lng}#brands`} color='gray.400' _hover={{ textDecoration: 'underline', color: 'gray.200' }}>
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
              key={item.name}
              onClick={() => router.push(`/${lng}/category/${encodeURIComponent(item.name)}`)}
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

          <Flex align='center' gap={4}>
            <Icon as={FaInstagram as ElementType} boxSize={5} cursor='pointer' _hover={{ color: 'gray.200' }} />
            <Icon as={FaFacebookF as ElementType} boxSize={5} cursor='pointer' _hover={{ color: 'gray.200' }} />
            <Icon as={FaYoutube as ElementType} boxSize={5} cursor='pointer' _hover={{ color: 'gray.200' }} />
            <Icon as={FaTelegram as ElementType} boxSize={5} cursor='pointer' _hover={{ color: 'gray.200' }} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
