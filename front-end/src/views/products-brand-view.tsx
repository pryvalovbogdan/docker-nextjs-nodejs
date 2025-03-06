'use client';

import { JSX, useState } from 'react';

import ProductCard from '@/entities/brand/ui/product-card';
import { IProductResponse } from '@/entities/product/model/types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import Pagination from '@/shared/ui/pagination';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { Layout } from '@widgets/layout';

interface BrandProductsProps {
  products: IProductResponse[];
  brandName: string;
  lng: string;
}

const data = {
  'quanta system':
    '<div>\n' +
    '\t\t\t<p>Італійська компанія Quanta System створена в 1985 році, спеціалізується на розробці і виробництві лазерних систем для хірургії та естетичної медицини, а також приладів для лазерної реставрації предметів старовини. Лазери Quanta System визнані професіоналами «Золотим стандартом» по ефективності, надійності і практичності.</p>\n' +
    '<p>Все виробництво розташоване в Італії - від розробки до збірки на високотехнологічних виробничих майданчиках у&nbsp;місті Самарате. Лазерні системи Quanta System поєднують в собі відповідність міжнародним стандартам з індивідуальним підходом до кожного клієнта.</p>\n' +
    '<p>Лазери Quanta System належать до вищого сегменту обладнання для естетичної медицини, пропонуючи унікальні комбіновані рішення з видалення тату, пігментних плям, доброякісних утворень, шрамів, а також лазерному омолодженню.</p>\n' +
    '<p>У секторі естетичної медицини Quanta System пропонує лінійний ряд лазерів Thunder для епіляції і видалення судинної патології; лінійку DISCOVERY PICO (лазери 2-го покоління для видалення тату і пігментних плям); лазер Youlaser з довжиною хвилі 10600 і 1540 нм для омолодження і видалення пігменту; серія Q-Switched олександритового і неодимового лазерів і багато іншого.</p>\n' +
    '<p style="text-align: center;"><strong>Quanta System - для тих, хто оибирає найкраще!</strong></p><p style="text-align:center;"><a href="/brands" style="background-color: var(--color-blue); padding: 5px 20px; color: #fff;">перейти до списку брендів</a></p>\n' +
    '        </div>',
};

const ProductsBrandView = ({ products, brandName, lng }: BrandProductsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile(768);

  const itemsPerPage = isMobile ? 2 : 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const normalizedBrandName = decodeURIComponent(brandName).trim().toLowerCase();
  const brandDescription = data[normalizedBrandName];

  return (
    <Layout lng={lng}>
      <Box as='section' id='brand-products' py={20} bg='white'>
        <Heading as='h3' fontSize='48px' textAlign='center' mb={6} color='gray.800'>
          {decodeURIComponent(brandName)}
        </Heading>

        {brandDescription && (
          <Box maxW='container.md' mx='auto' textAlign='justify' mb={10} px={{ base: 6, md: 10 }}>
            <div
              dangerouslySetInnerHTML={{
                __html: `
                          <style>
                            p { text-indent: 20px; margin-bottom: 10px; }
                            b, strong { padding-right: 5px; padding-left: 5px; }
                          </style>
                          ${brandDescription}
                        `,
              }}
            />
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} maxW='container.xl' mx='auto' px={4} spacing={6}>
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} lng={lng} />
          ))}
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
