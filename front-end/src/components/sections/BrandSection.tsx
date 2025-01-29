'use client';

import React from 'react';

import { Box, Card, Heading, Image, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const brandData = [
  {
    src: '/agfa.png',
    alt: 'Agfa Logo',
    name: 'Agfa',
  },
  {
    src: '/biosystems.png',
    alt: 'Biosystems Logo',
    name: 'Biosystems',
  },
  {
    src: '/canon.png',
    alt: 'Canon Logo',
    name: 'Canon',
  },
  {
    src: '/hitachi.avif',
    alt: 'Hitachi Logo',
    name: 'Hitachi',
  },
  {
    src: '/olympus.jpg',
    alt: 'Olympus Logo',
    name: 'Olympus',
  },
  {
    src: '/villa.jpeg',
    alt: 'Villa Logo',
    name: 'Villa',
  },
  {
    src: '/vinno.png',
    alt: 'Vinno Logo',
    name: 'Vinno',
  },
];

const BrandsSection = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);

  return (
    <Box as='section' id='brands' py={20} bg='white'>
      <Heading as='h3' fontSize='48px' textAlign='center' mb={10}>
        Brands
      </Heading>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={6} maxW='container.xl' mx='auto' gap={10}>
        {brandData.map(brand => {
          return (
            <Card.Root
              maxW='sm'
              overflow='hidden'
              key={brand.src}
              bg='white'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              borderRadius='30px'
              border='none'
              boxShadow='0px -0px 2px -0px rgba(15, 151, 181, 0.14), 0px 24px 61px -14px rgba(15, 151, 181, 0.14)'
              color='black'
              textAlign='center'
              p={4}
              cursor='pointer'
            >
              <Box display='flex' justifyContent='center' alignItems='center' mb={4}>
                <Image src={brand.src} alt={brand.alt} boxSize='100px' objectFit='contain' />
              </Box>
              <Card.Body gap='2'>
                <Card.Title>{brand.name}</Card.Title>
                <Card.Description>{t(brand.name.toLowerCase())}</Card.Description>
              </Card.Body>
            </Card.Root>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default BrandsSection;
