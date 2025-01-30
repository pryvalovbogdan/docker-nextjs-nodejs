import React from 'react';

import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const CategoriesSection = () => (
  <Box as='section' id='categories' py={20} bg='cyan.50'>
    <Heading as='h3' size='lg' textAlign='center' mb={10}>
      Popular Categories
    </Heading>
    <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} maxW='container.xl' mx='auto'>
      {['Diagnostics', 'Surgical', 'Therapeutic', 'Monitoring'].map(category => (
        <Box key={category} bg='white' p={4} textAlign='center' shadow='md' borderRadius='md'>
          <Text fontSize='xl' fontWeight='bold'>
            {category}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

export default CategoriesSection;
