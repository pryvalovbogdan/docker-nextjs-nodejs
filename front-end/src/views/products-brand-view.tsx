'use client';

import React, { JSX, useState } from 'react';

import ProductCard from '@/entities/brand/ui/product-card';
import { IProductResponse } from '@/entities/product/model/types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import Pagination from '@/shared/ui/pagination';
import { brandData } from '@/shared/utils/data';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

interface BrandProductsProps {
  products: IProductResponse[];
  brandName: string;
  lng: string;
}

const ProductsBrandView = ({ products, brandName, lng }: BrandProductsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile(768);
  const { t } = useTranslation(lng);

  const itemsPerPage = isMobile ? 2 : 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const normalizedBrandName = decodeURIComponent(brandName).trim().toLowerCase();
  const brandDescription = brandData.find(item => {
    return item.name.toLowerCase() === normalizedBrandName;
  })?.description;

  return (
    <Layout lng={lng}>
      <Box as='section' id='brand-products' py={20} bg='white'>
        <Heading as='h3' fontSize='48px' textAlign='center' mb={6} color='gray.800'>
          {decodeURIComponent(brandName)}
        </Heading>

        {brandDescription && (
          <Box
            maxW='container.md'
            mx='auto'
            textAlign='justify'
            mb={10}
            px={{ base: 6, md: 10 }}
            className='brand-description-container'
          >
            <div
              dangerouslySetInnerHTML={{
                __html: `
                          <style>
                            .brand-description-container p { 
                              text-indent: 20px; 
                              margin-bottom: 10px; 
                            }
                            .brand-description-container b, 
                            .brand-description-container strong { 
                              padding-right: 5px; 
                              padding-left: 5px; 
                            }
                          </style>
                          <div class="brand-description-container">
                            ${brandDescription}
                          </div>
                        `,
              }}
            />
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} maxW='container.xl' mx='auto' px={4}>
          {paginatedProducts.length === 0 ? (
            <Text fontSize='xl' color='gray.600' textAlign='center'>
              {t('noProducts')}
            </Text>
          ) : (
            paginatedProducts.map(product => <ProductCard key={product.id} product={product} lng={lng} />)
          )}
        </SimpleGrid>
        {totalPages > 1 &&
          ((
            <Box mt={products.length > 8 ? 16 : 8} mx={15}>
              <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </Box>
          ) as JSX.Element)}
      </Box>
    </Layout>
  );
};

export default ProductsBrandView;
