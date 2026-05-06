'use client';

import React from 'react';

import { Box, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { ColorModeButton } from '@/shared/ui/color-mode';
import { ContactButton } from '@features/contact';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';
import { WhyUs } from '@widgets/why-us';

interface AboutViewProps {
  lng: string;
  officePhoneSecond?: string;
  officePhone?: string;
  officeEmail?: string;
  origin?: string;
}

const AboutView = ({ lng, officePhoneSecond, officePhone, officeEmail, origin }: AboutViewProps) => {
  const { t } = useTranslation(lng);

  return (
    <Layout
      lng={lng}
      officePhoneSecond={officePhoneSecond}
      officePhone={officePhone}
      officeEmail={officeEmail}
      origin={origin}
    >
      <Container maxW='container.xl' py={16} position='relative'>
        <Box position='absolute' top={4} right={4} zIndex={10}>
          <ColorModeButton />
        </Box>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align='center'
          gap={10}
          bg='rgba(3, 103, 83, 0.1)'
          _dark={{
            bg: 'rgba(3, 103, 83, 0.2)',
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.5)',
            borderColor: 'rgba(3, 103, 83, 0.4)',
          }}
          backdropFilter='blur(8px)'
          borderRadius='lg'
          boxShadow='lg'
          border='1px solid'
          borderColor='transparent'
          p={10}
          transition='all 0.3s ease'
        >
          <Box flex='1'>
            <Heading as='h2' size='xl' mb={4} color='gray.800' _dark={{ color: 'gray.100' }}>
              {t('aboutUs')}
            </Heading>
            <Text fontSize='lg' color='gray.700' _dark={{ color: 'gray.300' }}>
              {t('aboutUsDescription')}
            </Text>
          </Box>

          <Box flex='1' textAlign='center'>
            <Image
              src='/support.png'
              alt='About Us'
              bg='white'
              _dark={{ bg: 'gray.700' }}
              maxW={{ base: '100%', md: '400px' }}
              mx='auto'
              borderRadius='lg'
              shadow='lg'
              transition='transform 0.3s ease-in-out'
              _hover={{ transform: 'scale(1.05)' }}
            />
          </Box>
        </Flex>

        <Box mt={16}>
          <WhyUs lng={lng} />
        </Box>
      </Container>
      <ContactButton lng={lng} />
    </Layout>
  );
};

export default AboutView;
