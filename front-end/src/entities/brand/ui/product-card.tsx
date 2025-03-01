'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { IProductResponse } from '@/entities/product/model/types';
import { Badge, Box, Flex, GridItem, Image, Text, VStack } from '@chakra-ui/react';
import { OrderDialog } from '@features/order';

interface ProductProps {
  product: IProductResponse;
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
      border='1px solid'
      borderColor='gray.300'
      rounded='lg'
      overflow='hidden'
      shadow='md'
      cursor='pointer'
      transition='all 0.3s'
      _hover={{
        shadow: 'xl',
        transform: 'scale(1.05)',
        borderColor: '#036753',
      }}
      onClick={handleRedirect}
    >
      <Box bg='gray.50' display='flex' justifyContent='center' alignItems='center'>
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.title}
          objectFit='contain'
          w='100%'
          h='250px'
          borderRadius='lg'
          transition='all 0.3s'
        />
      </Box>

      <VStack align='start' p={4}>
        <Text fontSize='lg' fontWeight='bold' color='gray.800'>
          {product.title}
        </Text>
        <Text fontSize='sm' color='gray.600'>
          {product.description}
        </Text>

        <Flex w='100%' alignItems='center' justify='space-between'>
          <Badge colorScheme='green' px={3} py={1} rounded='md'>
            {product.country || 'Unknown'}
          </Badge>
          <OrderDialog product={product} lng={lng} />
        </Flex>

        {product.price && (
          <Text fontSize='xl' fontWeight='semibold' color='#036753'>
            ${product.price.toFixed(2)}
          </Text>
        )}
      </VStack>
    </GridItem>
  );
};

export default ProductCard;
