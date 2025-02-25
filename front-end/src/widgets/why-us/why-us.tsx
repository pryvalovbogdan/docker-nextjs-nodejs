'use client';

import { ElementType, ReactElement } from 'react';
import { FaCheckCircle, FaCreditCard, FaHeadset, FaTruck } from 'react-icons/fa';

import { Box, Flex, Heading, Icon, Image, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const services = [
  {
    title: 'interestFreeInstallments',
    description: 'interestFreeInstallmentsDescription',
    icon: FaCreditCard,
  },
  {
    title: 'serviceSupport',
    description: 'serviceSupportDescription',
    icon: FaHeadset,
  },
  {
    title: 'officialGuarantee',
    description: 'officialGuaranteeDescription',
    icon: FaCheckCircle,
  },
  {
    title: 'freeDelivery',
    description: 'freeDeliveryDescription',
    icon: FaTruck,
  },
];

export default function WhyUs({ lng, withHeading }: { lng: string; withHeading?: boolean }) {
  const { t } = useTranslation(lng);

  return (
    <Box>
      {withHeading &&
        ((
          <Heading as='h2' size='xl' mb={4}>
            {t('whyUs')}
          </Heading>
        ) as ReactElement)}
      <Stack spacing={6} mt={10}>
        {services.map((service, index) => (
          <Flex key={index} align='center' bg='gray.50' p={5} borderRadius='md' boxShadow='md'>
            <Icon as={service.icon as ElementType} boxSize={8} color='green.500' mr={4} />
            <Box>
              <Heading size='md'>{t(service.title)}</Heading>
              <Text>{t(service.description)}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>

      <Flex direction={{ base: 'column', md: 'row' }} align='center' mt={10} p={5} bg='gray.100' borderRadius='md'>
        <Box flex='1'>
          <Heading size='lg' color='green.600'>
            {t('available24')}
          </Heading>
          <Text fontSize='lg'>{t('available24Description')}</Text>
        </Box>
        <Box flex='1' textAlign='center'>
          <Image src='/24-7-support.webp' alt='24/7 Support' maxW='200px' mx='auto' />
        </Box>
      </Flex>
    </Box>
  );
}
