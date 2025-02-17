'use client';

import React, { useState } from 'react';

import { Box, Button, Flex, Grid, Heading, Image, Text, VStack } from '@chakra-ui/react';

const categories = [
  {
    id: 'endoscopy',
    name: 'Ендоскопія',
    subcategories: [
      { id: 'rigid-endoscopy', name: 'Жорстка ендоскопія' },
      { id: 'flexible-endoscopy', name: 'Гнучка ендоскопія' },
    ],
    products: [
      {
        id: 'huge-med-ms8',
        name: 'Гнучкий відеоендоскоп HugeMed MS-8',
        description: 'Універсальна станція MS-8 – це одна центральна система.',
        image: '/images/huge-med-ms8.jpg',
      },
      {
        id: 'allgaier',
        name: 'Ендоскопічна стійка ALLGAIER (Німеччина)',
        description: 'З моменту заснування Allgaier Instruments GmbH.',
        image: '/images/allgaier.jpg',
      },
      {
        id: 'huge-med-hu30',
        name: 'Гнучкий уретерореноскоп HugeMed HU30 / HU30S',
        description: 'Гнучкий уретерореноскоп використовується для лікування.',
        image: '/images/huge-med-hu30.jpg',
      },
      {
        id: 'allgaier',
        name: 'Ендоскопічна стійка ALLGAIER (Німеччина)',
        description: 'З моменту заснування Allgaier Instruments GmbH.',
        image: '/images/allgaier.jpg',
      },
      {
        id: 'huge-med-hu30',
        name: 'Гнучкий уретерореноскоп HugeMed HU30 / HU30S',
        description: 'Гнучкий уретерореноскоп використовується для лікування.',
        image: '/images/huge-med-hu30.jpg',
      },
      {
        id: 'allgaier',
        name: 'Ендоскопічна стійка ALLGAIER (Німеччина)',
        description: 'З моменту заснування Allgaier Instruments GmbH.',
        image: '/images/allgaier.jpg',
      },
      {
        id: 'huge-med-hu30',
        name: 'Гнучкий уретерореноскоп HugeMed HU30 / HU30S',
        description: 'Гнучкий уретерореноскоп використовується для лікування.',
        image: '/images/huge-med-hu30.jpg',
      },
      {
        id: 'allgaier',
        name: 'Ендоскопічна стійка ALLGAIER (Німеччина)',
        description: 'З моменту заснування Allgaier Instruments GmbH.',
        image: '/images/allgaier.jpg',
      },
      {
        id: 'huge-med-hu30',
        name: 'Гнучкий уретерореноскоп HugeMed HU30 / HU30S',
        description: 'Гнучкий уретерореноскоп використовується для лікування.',
        image: '/images/huge-med-hu30.jpg',
      },
    ],
  },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <Flex p={4} gap={6}>
      <VStack align='start' w='250px' spacing={2}>
        <Heading size='md'>Категорії</Heading>
        {categories.map(category => (
          <Box key={category.id} w='full'>
            <Button
              w='full'
              fontWeight='bold'
              bg='linear-gradient(135deg, #50C878 0%, #20B2AA 100%)'
              justifyContent='flex-start'
              onClick={() => setExpandedCategory(category.id === expandedCategory ? null : category.id)}
            >
              {category.name}
            </Button>
            {category.id === expandedCategory &&
              ((
                <VStack align='start' pl={4}>
                  {category.subcategories.map(sub => (
                    <Button
                      key={sub.id}
                      variant='link'
                      bg='linear-gradient(135deg, #50C878 0%, #20B2AA 100%)'
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {sub.name}
                    </Button>
                  ))}
                </VStack>
              ) as React.ReactElement)}
          </Box>
        ))}
      </VStack>
      <Grid templateColumns='repeat(auto-fit, minmax(250px, 1fr))' gap={6} flex={1}>
        {categories
          .find(cat => cat.id === selectedCategory)
          ?.products.map(product => (
            <Box key={product.id} borderWidth={1} p={4} borderRadius='md' shadow='md'>
              <Image src={product.image} alt={product.name} mb={2} borderRadius='md' />
              <Heading size='sm'>{product.name}</Heading>
              <Text fontSize='sm' mt={2}>
                {product.description}
              </Text>
            </Box>
          ))}
      </Grid>
    </Flex>
  );
}
