'use client';

import React from 'react';

import { Badge, Box, Button, Flex, Grid, GridItem, Image, Link, Text, VStack } from '@chakra-ui/react';

// Define the Product type
export interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  country?: string;
  category?: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  console.log('products', products);

  return (
    <Box py={8} px={4}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
        {products?.map(product => (
          <Link href={`/uk/product/${product.id}`} key={product.id}>
            <GridItem
              key={product.id}
              bg='white'
              border='1px'
              borderColor='gray.200'
              rounded='lg'
              overflow='hidden'
              shadow='md'
              _hover={{ shadow: 'lg' }}
              cursor='pointer'
            >
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.title}
                objectFit='contain'
                w='full'
                maxHeight={300}
              />
              <VStack align='start' p={4} spacing={2}>
                <Text fontSize='lg' fontWeight='bold'>
                  {product.title}
                </Text>
                <Text fontSize='sm' color='gray.500' noOfLines={2}>
                  {product.description}
                </Text>
                <Flex w='100%' alignItems='center' justify='space-between'>
                  <Badge colorScheme='blue' px={2} py={1} rounded='md'>
                    {product.country || 'Unknown'}
                  </Badge>
                  <Button
                    size='sm'
                    type='submit'
                    bg='#24BEE0'
                    color='white'
                    borderRadius='27px'
                    display='inline-flex'
                    w='auto'
                  >
                    Замовити
                  </Button>
                </Flex>
                {product.price && (
                  <Text fontSize='xl' fontWeight='semibold' color='green.600'>
                    ${product.price.toFixed(2)}
                  </Text>
                )}
              </VStack>
            </GridItem>
          </Link>
        ))}
        {!products.length && <Text>По данному бренду нема продуктів</Text>}
      </Grid>
    </Box>
  );
};

export default ProductList;
