'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IProductResponse } from '@/entities/product/model/types';
import { getIsShownDescription, hasValidContent, processDescriptionGeo, sanitizeHTML } from '@/shared/utils';
import { descriptionStyles } from '@/views/product-view/utils/consts';
import { ImageDialog, Layout } from '@/widgets/';
import { Badge, Box, Breadcrumb, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { ContactButton } from '@features/contact';
import { OrderDialog } from '@features/order';
import { useTranslation } from '@i18n/client';
import { ImageButtons } from '@widgets/image-dialog/ui';

interface ProductProps {
  product: IProductResponse;
  lng: string;
  officePhone: string;
  officePhoneSecond: string;
  officeEmail: string;
}

const ProductView: React.FC<ProductProps> = ({ product, lng, officePhone, officePhoneSecond, officeEmail }) => {
  const { t } = useTranslation(lng);
  const [showMore, setShowMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '/placeholder.webp');
  const [isDialogOpen, setDialogOpen] = useState(false);

  const images = useMemo(() => product.images || [], [product.images]);
  const currentIndex = images.indexOf(selectedImage);

  const toggleShowMore = () => setShowMore(!showMore);

  const goToPreviousImage = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
  }, [currentIndex, images]);

  const goToNextImage = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goToPreviousImage();

      if (event.key === 'ArrowRight') goToNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousImage, goToNextImage]);

  const isShownDescription = hasValidContent(product.description) && getIsShownDescription(product.description || '');

  return (
    <Layout lng={lng} officePhone={officePhone} officePhoneSecond={officePhoneSecond} officeEmail={officeEmail}>
      <Flex mt={10}>
        <Breadcrumb.Root
          bg='rgba(3, 103, 83, 0.7)'
          ml={6}
          py={2}
          px={4}
          mr={6}
          backdropFilter='blur(12px)'
          borderRadius='md'
        >
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href={`/${lng}/category/${product.category?.path}`}
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
            <Box cursor='pointer' position='relative'>
              <Image
                src={selectedImage}
                alt={product.title}
                objectFit='contain'
                w='100%'
                h='350px'
                borderRadius='lg'
                boxShadow='lg'
                mb={4}
                onClick={() => setDialogOpen(true)}
              />
              {images.length > 1 && (
                <ImageButtons
                  images={images}
                  goToNextImage={goToNextImage}
                  goToPreviousImage={goToPreviousImage}
                  currentIndex={currentIndex}
                />
              )}
            </Box>

            {images.length > 1 && (
              <Flex gap={2} overflowX='auto'>
                {images.map(img => (
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
            {isShownDescription && (
              <Box
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
                dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      ${descriptionStyles}
                    </style>     
                    <div class="description-container">
                       <div class="short-description">
                          ${sanitizeHTML(processDescriptionGeo(product.description || '') || product.characteristics || '')}
                       </div>
                    </div>
                  `,
                }}
              />
            )}

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
              {hasValidContent(product.description) && (
                <>
                  <Heading size='md' mb={2} color='gray.800'>
                    {t('detailedDescription')}
                  </Heading>

                  <Box
                    color='gray.700'
                    dangerouslySetInnerHTML={{
                      __html: `
                          <div class="description-container">
                             <div class="full-description">
                              ${product.description || ''}
                             </div>
                          </div>
                      `,
                    }}
                  />
                </>
              )}

              {hasValidContent(product.characteristics) && (
                <>
                  <Heading size='md' mt={4} mb={2} color='gray.800'>
                    {t('characteristics')}
                  </Heading>
                  <Box
                    color='gray.700'
                    dangerouslySetInnerHTML={{
                      __html: `
                          <div class="description-container">
                             <div class="full-characteristic">
                               ${product.characteristics || ''}
                             </div>
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
      <ImageDialog
        images={images}
        currentIndex={currentIndex}
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        goToPreviousImage={goToPreviousImage}
        goToNextImage={goToNextImage}
        selectedImage={selectedImage}
      />

      <ContactButton lng={lng} />
    </Layout>
  );
};

export default ProductView;
