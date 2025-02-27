'use client';

import React, { useState } from 'react';

import { IProductResponse } from '@/entities/product/model/types';
import { Badge, Box, Breadcrumb, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { OrderDialog } from '@features/order';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

interface ProductProps {
  product: IProductResponse;
  lng: string;
}

const ProductView: React.FC<ProductProps> = ({ product, lng }) => {
  const { t } = useTranslation(lng);
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <Layout lng={lng}>
      <Flex ml={10}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href='#' color='blue.600' _hover={{ color: 'blue.700' }}>
                {product.category.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />

            {product.subCategory?.name && (
              <>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href='#' color='blue.600' _hover={{ color: 'blue.700' }}>
                    {product.subCategory.name}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
              </>
            )}
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink color='blue.800' fontWeight='bold'>
                {product.title}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Flex>

      <Box py={8} px={6} maxW='6xl' mx='auto'>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flex='1' maxW='500px'>
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.title}
              objectFit='contain'
              w='100%'
              h='300px'
              borderRadius='md'
              mb={4}
            />
            {product.images?.length > 1 && (
              <Flex gap={2} overflowX='auto'>
                {product.images?.map(img => (
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

            <OrderDialog product={product} lng={lng} />
          </Box>
        </Flex>

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
