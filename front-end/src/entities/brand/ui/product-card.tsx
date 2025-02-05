import React from 'react';

import { Badge, Button, Flex, GridItem, Image, Link, Text, VStack } from '@chakra-ui/react';

interface ProductProps {
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    description: string;
    country: string;
  };
}

const ProductCard = ({ product }: ProductProps) => {
  return (
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
        <VStack align='start' p={4}>
          <Text fontSize='lg' fontWeight='bold'>
            {product.title}
          </Text>
          <Text fontSize='sm' color='gray.500'>
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
  );
};

export default ProductCard;
