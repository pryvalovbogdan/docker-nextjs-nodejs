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
      <Flex>
        <Breadcrumb.Root bg='rgba(3, 103, 83, 0.7)' ml={10} py={2} px={4} backdropFilter='blur(12px)' borderRadius='md'>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href='#' color='white' _hover={{ color: '#F2F2F2' }}>
                {product.category.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />

            {product.subCategory?.name && (
              <>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href='#' color='white' _hover={{ color: '#F2F2F2' }}>
                    {product.subCategory.name}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
              </>
            )}
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink color='white' fontWeight='bold'>
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
              h='350px'
              borderRadius='lg'
              boxShadow='lg'
              mb={4}
            />

            {product.images && product.images?.length > 1 && (
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
                    border='2px solid transparent'
                    _hover={{ border: '2px solid #036753', opacity: 0.8 }}
                    transition='all 0.3s'
                  />
                ))}
              </Flex>
            )}
          </Box>

          <Box flex='1'>
            <Heading size='lg' color='gray.800'>
              {product.title}
            </Heading>
            <Text fontSize='md' color='gray.600' mt={2}>
              {product.brand && (
                <Badge bg='#036753' color='white' mr={2} px={2} py={1} borderRadius='md'>
                  {product.brand}
                </Badge>
              )}
              {product.country && (
                <Badge bg='gray.500' color='white' px={2} py={1} borderRadius='md'>
                  {product.country}
                </Badge>
              )}
            </Text>
            <Text
              mt={4}
              fontSize='lg'
              color='gray.700'
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {product.description || product.characteristics}
            </Text>

            {product.price && (
              <Text fontSize='2xl' fontWeight='bold' color='#036753' mt={3}>
                ${product.price.toFixed(2)}
              </Text>
            )}
            <Box mt={4}>
              <OrderDialog product={product} lng={lng} />
            </Box>
          </Box>
        </Flex>

        <Box mt={6} borderTop='1px solid' borderColor='gray.300' pt={4}>
          <Button
            size='md'
            onClick={toggleShowMore}
            variant='outline'
            borderColor='#036753'
            color='#036753'
            _hover={{ bg: '#036753', color: 'white' }}
            transition='all 0.2s'
          >
            {showMore ? t('hideDetails') : t('showMore')}
          </Button>

          {showMore && (
            <Box mt={4}>
              <Heading size='md' mb={2} color='gray.800'>
                {t('detailedDescription')}
              </Heading>
              <Text color='gray.700'>{product.description}</Text>

              {product.characteristics && (
                <>
                  <Heading size='md' mt={4} mb={2} color='gray.800'>
                    {t('characteristics')}
                  </Heading>
                  <Text color='gray.700'>{product.characteristics}</Text>
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
