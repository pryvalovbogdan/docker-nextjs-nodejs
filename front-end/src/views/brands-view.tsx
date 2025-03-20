'use client';

import { useRouter } from 'next/navigation';

import { brandData } from '@/shared/utils/data';
import { Box, Container, Heading, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { ContactButton } from '@features/contact';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const BrandsPage = ({
  lng,
  officePhone,
  officePhoneSecond,
  officeEmail,
}: {
  lng: string;
  officePhone: string;
  officePhoneSecond: string;
  officeEmail: string;
}) => {
  const router = useRouter();
  const { t } = useTranslation(lng);
  const handleBrandClick = (brandName: string) => {
    router.push(`/${lng}/brand/${brandName}`);
  };

  return (
    <Layout lng={lng} officePhone={officePhone} officePhoneSecond={officePhoneSecond} officeEmail={officeEmail}>
      <Container
        maxW='container.xl'
        py={10}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Text fontSize='3xl' fontWeight='bold' color='gray.800' mb={5}>
          {t('brands')}
        </Text>
        <Box maxW='container.lg' mx='auto' px={{ base: 6, md: 12 }} w='100%'>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={2} justifyItems='center'>
            {brandData.map(brand => (
              <VStack
                key={brand.name}
                bg='white'
                boxShadow='md'
                borderRadius='lg'
                cursor='pointer'
                py={6}
                w='100%'
                maxW='450px'
                transition='all 0.3s'
                _hover={{ boxShadow: 'lg', transform: 'scale(1.05)', borderColor: 'emerald.600' }}
                onClick={() => handleBrandClick(brand.name)}
              >
                <Heading as='h3' size='md' color='gray.800'>
                  {brand.name}
                </Heading>
                <Image src={brand.src} alt={brand.alt} boxSize='120px' objectFit='contain' />
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
      <ContactButton lng={lng} />
    </Layout>
  );
};

export default BrandsPage;
