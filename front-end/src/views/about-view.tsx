'use client';

import { Box, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';
import { WhyUs } from '@widgets/why-us';

interface AboutViewProps {
  lng: string;
}

const AboutView = ({ lng }: AboutViewProps) => {
  const { t } = useTranslation(lng);

  return (
    <Layout lng={lng}>
      <Container maxW='container.xl' py={16}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align='center'
          gap={10}
          bg='rgba(3, 103, 83, 0.1)'
          backdropFilter='blur(8px)'
          borderRadius='lg'
          boxShadow='lg'
          p={10}
        >
          <Box flex='1'>
            <Heading as='h2' size='xl' mb={4} color='gray.800'>
              {t('aboutUs')}
            </Heading>
            <Text fontSize='lg' color='gray.700'>
              {t('aboutUsDescription')}
            </Text>
            <Text fontSize='lg' mt='10px' color='gray.700'>
              {t('aboutUsWork')}
            </Text>
            <Text fontSize='lg' mt='10px' color='gray.700'>
              {t('aboutUsConsult')}
            </Text>
          </Box>

          <Box flex='1' textAlign='center'>
            <Image
              src='/support.png'
              alt='About Us'
              bg='white'
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
    </Layout>
  );
};

export default AboutView;
