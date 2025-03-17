'use client';

import React, { useState } from 'react';

import { IProductResponse } from '@/entities/product/model/types';
import { Badge, Box, Breadcrumb, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { OrderDialog } from '@features/order';
import { useTranslation } from '@i18n/client';
import { ContactButton } from '@widgets/contact';
import { Layout } from '@widgets/layout';

// src/descriptionStyles.ts
export const descriptionStyles = `
    /* General Container */
    .description-container {
        font-size: 16px;
        line-height: 1.8;
        color: #333;
        padding: 20px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        margin-bottom: 20px;
    
    /* Headings */
    h1, h2, h3, h4, h5, h6 {
        color: #036753;
        margin-top: 18px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    /* Paragraphs */
    p {
        font-size: 17px;
        color: #444;
        line-height: 1.8;
        margin-bottom: 12px;
    }
    
    /* Strong and Bold Text */
    strong, b {
        color: #024E42;
        font-weight: bold;
    }

    /* Span Styling */
    span {
        font-size: 16px;
        color: #444;
    }
    
    /* Lists */
    ul, ol {
        margin: 15px 0;
        padding-left: 20px;
    }
    ul li, ol li {
        margin-bottom: 6px;
        font-size: 16px;
        color: #333;
    }
    ul li::before {
        content: "• ";
        color: #036753;
        font-weight: bold;
    }

    /* Tables */
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        font-size: 16px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 14px;
        text-align: left;
    }
    th {
        background-color: #036753;
        color: white;
        font-weight: bold;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    tr:hover {
        background-color: #f1f1f1;
    }
    @media (max-width: 768px) {
        table {
            font-size: 14px;
        }
        th, td {
            padding: 10px;
        }
    }

    /* Links & Buttons */
    a {
        color: #036753;
        font-weight: bold;
        text-decoration: none;
        transition: all 0.3s ease;
    }
    a:hover {
        color: #024E42;
        text-decoration: underline;
    }
    button {
        background: #036753;
        color: white;
        font-size: 16px;
        padding: 10px 15px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    button:hover {
        background: #024E42;
    }

    /* Images */
    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 10px auto;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Videos (YouTube, etc.) */
    iframe {
        width: 100%;
        max-width: 720px;
        height: 400px;
        display: block;
        margin: 15px auto;
        border-radius: 6px;
    }

    /* Horizontal Rule */
    hr {
        border: none;
        height: 2px;
        background: #036753;
        margin: 15px 0;
    }
    
    ul, ol {
        margin: 15px 0;
        padding-left: 20px;
    }
    
    ul li, ol li {
        margin-bottom: 6px;
        font-size: 16px;
        color: #333;
        list-style: none;
    }
    
    ul li::before {
        content: "• ";
        color: #036753;
        font-weight: bold;
    }
    
    ul li[style*="color: #00d78a"]::before {
        content: none;
    }
    }
`;

interface ProductProps {
  product: IProductResponse;
  lng: string;
  officePhone: string;
  officePhoneSecond: string;
  officeEmail: string;
}
const sanitizeHTML = (html: string) => {
  return html.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
};

const ProductView: React.FC<ProductProps> = ({ product, lng, officePhone, officePhoneSecond, officeEmail }) => {
  const { t } = useTranslation(lng);
  const [showMore, setShowMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '/placeholder.png');

  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <Layout lng={lng} officePhone={officePhone} officePhoneSecond={officePhoneSecond} officeEmail={officeEmail}>
      <Flex mt={10}>
        <Breadcrumb.Root bg='rgba(3, 103, 83, 0.7)' ml={10} py={2} px={4} backdropFilter='blur(12px)' borderRadius='md'>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href={`/${lng}/category/${product.category?.name}`}
                color='white'
                _hover={{ color: '#F2F2F2' }}
              >
                {product.category?.name}
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
              src={selectedImage}
              alt={product.title}
              objectFit='contain'
              w='100%'
              h='350px'
              borderRadius='lg'
              boxShadow='lg'
              mb={4}
            />

            {product.images && product.images.length > 1 && (
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
                    border={selectedImage === img ? '2px solid #036753' : '2px solid transparent'}
                    _hover={{ border: '2px solid #036753', opacity: 0.8 }}
                    transition='all 0.3s'
                    onClick={() => setSelectedImage(img)}
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
            <Box
              mt={4}
              fontSize='lg'
              color='gray.700'
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 9,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              dangerouslySetInnerHTML={{
                __html: `
                    <div class="description-container">
                      ${sanitizeHTML(product.description || product.characteristics || '')}
                    </div>
                  `,
              }}
            />

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

              <Box
                color='gray.700'
                dangerouslySetInnerHTML={{
                  __html: `
                      <style>
                      ${descriptionStyles}
                      </style>    
                  
                      <div class="description-container">
                          ${product.description || ''}
                      </div>
                  `,
                }}
              />

              {product.characteristics && (
                <>
                  <Heading size='md' mt={4} mb={2} color='gray.800'>
                    {t('characteristics')}
                  </Heading>
                  <Box
                    color='gray.700'
                    dangerouslySetInnerHTML={{
                      __html: `
                          <div class="description-container">
                              ${product.characteristics || ''}
                          </div>
                      `,
                    }}
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <ContactButton lng={lng} />
    </Layout>
  );
};

export default ProductView;
