'use client';

import React, { useState } from 'react';

import { Product } from '@/entities/product/model/types';
import { Badge, Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { OrderDialog } from '@features/order';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

interface ProductProps {
  product: Product;
  lng: string;
}

const ProductView: React.FC<ProductProps> = ({ product, lng }) => {
  const { t } = useTranslation(lng);
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <Layout>
      <Box py={8} px={6} maxW='6xl' mx='auto'>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          {/* Product Images */}
          <Box flex='1' maxW='500px'>
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.title}
              objectFit='contain'
              w='100%'
              h='300px'
              borderRadius='md'
              mb={4}
            />
            {product.images.length > 1 && (
              <Flex gap={2} overflowX='auto'>
                {product.images.map(img => (
                  <Image
                    key={img}
                    src={img}
                    alt='Thumbnail'
                    w='80px'
                    h='80px'
                    objectFit='cover'
                    borderRadius='md'
                    cursor='pointer'
                    _hover={{ opacity: 0.8 }}
                  />
                ))}
              </Flex>
            )}
          </Box>

          {/* Product Info */}
          <Box flex='1'>
            <Heading size='lg'>{product.title}</Heading>
            <Text fontSize='md' color='gray.600' mt={2}>
              {product.brand && (
                <Badge colorScheme='blue' mr={2}>
                  {product.brand}
                </Badge>
              )}
              {product.country && <Badge colorScheme='green'>{product.country}</Badge>}
            </Text>
            <Text mt={4} fontSize='lg'>
              {product.description}
            </Text>

            {product.price && (
              <Text fontSize='xl' fontWeight='bold' color='teal.500' mt={3}>
                ${product.price.toFixed(2)}
              </Text>
            )}

            {/* Order Dialog */}
            <OrderDialog product={product} lng={lng} />
          </Box>
        </Flex>

        {/* Show More Toggle */}
        <Box mt={6} borderTop='1px solid' borderColor='gray.300' pt={4}>
          <Button size='sm' onClick={toggleShowMore} variant='outline' colorScheme='blue'>
            {showMore ? t('hideDetails') : t('showMore')}
          </Button>

          {showMore && (
            <Box mt={4}>
              <Heading size='md' mb={2}>
                {t('detailedDescription')}
              </Heading>
              <Text>{product.description}</Text>
              {product.characteristics && (
                <>
                  <Heading size='md' mt={4} mb={2}>
                    {t('characteristics')}
                  </Heading>
                  <Text>{product.characteristics}</Text>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default ProductView;
