import React from 'react';

import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const TopSalesSection = () => (
  <Box as='section' id='top-sales' py={20} bg='white'>
    <Heading as='h3' size='lg' textAlign='center' mb={10}>
      Top Sales
    </Heading>
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} maxW='container.xl' mx='auto'>
      {['Product A', 'Product B', 'Product C'].map(product => (
        <Box key={product} bg='cyan.100' p={4} shadow='md' borderRadius='md'>
          <Heading as='h4' size='md' mb={2}>
            {product}
          </Heading>
          <Text>Best-selling product with excellent reviews.</Text>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

export default TopSalesSection;
