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
      <Container maxW='container.xl' py={10}>
        <Flex direction={{ base: 'column', md: 'row' }} align='center' gap={8}>
          <Box flex='1'>
            <Heading as='h2' size='xl' mb={4}>
              {t('aboutUs')}
            </Heading>
            <Text fontSize='lg'> {t('aboutUsDescription')}</Text>
            <Text fontSize='lg' mt='10px'>
              {' '}
              {t('aboutUsWork')}
            </Text>
            <Text fontSize='lg' mt='10px'>
              {' '}
              {t('aboutUsConsult')}
            </Text>
          </Box>
          <Box flex='1' textAlign='center'>
            <Image src='/support.png' alt='About Us' maxW='400px' mx='auto' />
          </Box>
        </Flex>
        <WhyUs lng={lng} />
      </Container>
    </Layout>
  );
};

export default AboutView;
