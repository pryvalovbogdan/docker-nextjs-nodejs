import React from 'react';

import { Box, Button, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react';

const ProductsSection = () => (
  <Box as='section' id='products' py={20}>
    <Heading as='h3' size='lg' textAlign='center' mb={10}>
      Our Products
    </Heading>
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} maxW='container.xl' mx='auto'>
      {['CT Scanner', 'Ultrasound Machine', 'Surgical Instruments', 'ECG Machine', 'Ventilators', 'X-Ray Machine'].map(
        product => (
          <Box key={product} bg='white' shadow='md' borderRadius='md' overflow='hidden'>
            <Image
              src={`https://via.placeholder.com/300x200?text=${product}`}
              alt={product}
              w='full'
              h='200px'
              objectFit='cover'
            />
            <Box p={4}>
              <Heading as='h4' size='md' mb={2}>
                {product}
              </Heading>
              <Text mb={4}>High-quality and reliable {product.toLowerCase()} for healthcare professionals.</Text>
              <Button colorScheme='blue' w='full'>
                Learn More
              </Button>
            </Box>
          </Box>
        ),
      )}
    </SimpleGrid>
  </Box>
);

export default ProductsSection;
