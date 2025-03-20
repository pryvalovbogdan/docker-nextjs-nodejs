'use client';

import React, { ElementType } from 'react';
import { FaClock, FaHandHoldingUsd, FaHeadset, FaShieldAlt, FaTools } from 'react-icons/fa';

import { LogoWrapper } from '@/shared/ui';
import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const services = [
  {
    title: 'interestFreeInstallments',
    description: 'interestFreeInstallmentsDescription',
    icon: FaHandHoldingUsd,
  },
  {
    title: 'serviceMaintenance',
    description: 'serviceMaintenanceDescription',
    icon: FaTools,
  },
  {
    title: 'warrantyService',
    description: 'warrantyServiceDescription',
    icon: FaShieldAlt,
  },
  {
    title: 'postWarrantyService',
    description: 'postWarrantyServiceDescription',
    icon: FaClock,
  },
  {
    title: 'customerSupport',
    description: 'customerSupportDescription',
    icon: FaHeadset,
  },
];

export default function WhyUs({ lng, withHeading }: { lng: string; withHeading?: boolean }) {
  const { t } = useTranslation(lng);

  return (
    <Box py={10} px={6} maxW='6xl' mx='auto'>
      {withHeading && (
        <Heading as='h2' size='xl' color='gray.800' textAlign='center' mb={6} fontSize='36px'>
          {t('whyUs')}
        </Heading>
      )}

      <Stack mt={6}>
        {services.map((service, index) => (
          <Flex
            key={index}
            align='center'
            bg='white'
            p={5}
            borderRadius='lg'
            boxShadow='md'
            border='1px solid'
            borderColor='gray.200'
            transition='all 0.3s'
            _hover={{ boxShadow: 'lg', borderColor: '#036753' }}
          >
            <Icon as={service.icon as ElementType} boxSize={10} color='#036753' mr={4} />
            <Box>
              <Heading size='md' color='gray.800'>
                {t(service.title as any)}
              </Heading>
              <Text color='gray.700'>{t(service.description as any)}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align='center'
        mt={10}
        p={6}
        bg='rgba(3, 103, 83, 0.7)'
        backdropFilter='blur(12px)'
        borderRadius='lg'
        boxShadow='lg'
        justifyContent='space-between'
      >
        <Box flex='1'>
          <Heading size='lg' color='white'>
            {t('available24')}
          </Heading>
          <Text fontSize='lg' color='white' mt={2}>
            {t('available24Description')}
          </Text>
        </Box>

        <LogoWrapper />
      </Flex>
    </Box>
  );
}
