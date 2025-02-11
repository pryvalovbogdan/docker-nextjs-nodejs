'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Product } from '@/entities/product/model/types';
import { Badge, Flex, GridItem, Image, Text, VStack } from '@chakra-ui/react';
import { OrderDialog } from '@features/order';

interface ProductProps {
  product: Product;
  lng: string;
}

const ProductCard = ({ product, lng }: ProductProps) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/${lng}/product/${product.id}`);
  };

  return (
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
      onClick={handleRedirect}
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
          <OrderDialog product={product} lng={lng} />
        </Flex>
        {product.price && (
          <Text fontSize='xl' fontWeight='semibold' color='green.600'>
            ${product.price.toFixed(2)}
          </Text>
        )}
      </VStack>
    </GridItem>
  );
};

export default ProductCard;
