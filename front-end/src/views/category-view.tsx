'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { IProductResponse } from '@/entities/product/model/types';
import Pagination from '@/shared/ui/pagination';
import { Box, Flex, Grid, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const ITEMS_PER_PAGE = 9;

const CategoryView: React.FC<{ lng: string; products: IProductResponse[]; query: string }> = ({
  lng,
  products,
  query,
}) => {
  const { t } = useTranslation(lng);
  const router = useRouter();

  const decodedQuery = decodeURIComponent(query);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const displayedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Layout lng={lng}>
      <Box maxW='6xl' mx='auto' py={8} px={6}>
        <Flex align='center' justifyContent='center' w='100%'>
          <Heading
            size='lg'
            mb={6}
            textAlign='center'
            fontWeight='bold'
            letterSpacing='wide'
            position='relative'
            color='white'
            bg='rgba(3, 103, 83, 0.7)'
            width='auto'
            p={4}
            backdropFilter='blur(12px)'
            borderRadius='md'
          >
            {decodedQuery}
          </Heading>
        </Flex>

        {products.length === 0 ? (
          <Text fontSize='xl' color='gray.600' textAlign='center'>
            {t('noProducts')}
          </Text>
        ) : (
          <>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(300px, 1fr))' }}
              gap={6}
              w='100%'
              alignItems='stretch'
              justifyContent='center'
              gridAutoRows='min-content'
            >
              {displayedProducts.map(product => (
                <Flex
                  key={product.id}
                  direction='column'
                  bg='white'
                  boxShadow='sm'
                  overflow='hidden'
                  borderWidth={1}
                  p={4}
                  borderRadius='lg'
                  shadow='md'
                  w='100%'
                  alignItems='center'
                  flexDirection='column'
                  cursor='pointer'
                  transition='all 0.3s'
                  borderColor='gray.200'
                  _hover={{
                    shadow: 'lg',
                    borderColor: '#036753',
                  }}
                  onClick={() => router.push(`/${lng}/product/${product.id}`)}
                  height='100%'
                  maxHeight='350px'
                  display='flex'
                  justifyContent='space-between'
                >
                  {product.images?.[0] && (
                    <Image
                      src={product.images?.[0]}
                      alt={product.title}
                      borderRadius='md'
                      height='180px'
                      objectFit='cover'
                      mb={3}
                    />
                  )}

                  <VStack align='start' spacing={2} w='100%'>
                    <Heading
                      size='sm'
                      color='black'
                      fontWeight='bold'
                      whiteSpace='nowrap'
                      overflow='hidden'
                      textOverflow='ellipsis'
                      maxWidth='100%'
                    >
                      {product.title}
                    </Heading>

                    <Text
                      fontSize='sm'
                      color='gray.600'
                      overflow='hidden'
                      textOverflow='ellipsis'
                      display='-webkit-box'
                      WebkitBoxOrient='vertical'
                      WebkitLineClamp={3}
                      lineHeight='1.4'
                      maxHeight='4.2em'
                    >
                      {product.description || product.characteristics}
                    </Text>

                    {product.price && (
                      <Text fontSize='md' fontWeight='bold' color='emerald.600'>
                        ${product.price.toFixed(2)}
                      </Text>
                    )}
                  </VStack>
                </Flex>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={setCurrentPage} />
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default CategoryView;
