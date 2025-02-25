'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Carousel, CarouselContextProvider, useCarouselContext } from 'react-carousel-cards-npm';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { IProductResponse } from '@/entities/product/model/types';
import { Box, Flex, Heading, IconButton, Image, useBreakpointValue } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const Card = ({
  style,
  name,
  title,
  images,
  maxWidth,
  width,
  id,
  lng,
}: {
  style: any;
  name: string;
  title: string;
  images: string[];
  maxWidth: string;
  width: string;
  id: string;
  lng: string;
}) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/${lng}/product/${id}`);
  };

  return (
    <Flex
      direction='column'
      boxShadow='md'
      borderRadius='lg'
      bg='white'
      overflow='hidden'
      align='center'
      cursor='pointer'
      {...style}
      onClick={handleRedirect}
    >
      <Box w='100%' display='flex' alignItems='center' justifyContent='center' bg='white'>
        <Image
          src={images[0] || '/placeholder.webp'}
          alt={name}
          objectFit='contain'
          maxW={maxWidth}
          h='250px'
          mt='20px'
          w={width}
        />
      </Box>
      <Box p={4} textAlign='center'>
        <Heading size='md'>{title}</Heading>
      </Box>
    </Flex>
  );
};

const CustomArrowsPreview = () => {
  const { handlePrevPage, currentPage, handleNextPage, totalPageCount } = useCarouselContext();

  return (
    <>
      <IconButton
        aria-label='Previous slide'
        position='absolute'
        left='10px'
        top='50%'
        transform='translateY(-50%)'
        bg='whiteAlpha.700'
        transition='background 0.3s ease-in-out'
        _hover={{ bg: 'gray.300' }}
        _active={{ bg: 'gray.400' }}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <LuChevronLeft size={24} />
      </IconButton>
      <IconButton
        aria-label='Next slide'
        position='absolute'
        right='10px'
        top='50%'
        transform='translateY(-50%)'
        bg='whiteAlpha.700'
        transition='background 0.3s ease-in-out'
        _hover={{ bg: 'gray.300' }}
        _active={{ bg: 'gray.400' }}
        onClick={handleNextPage}
        disabled={currentPage === totalPageCount}
      >
        <LuChevronRight size={24} />
      </IconButton>
    </>
  );
};

export default function LastAddedProducts({ products, lng }: { products: IProductResponse[]; lng: string }) {
  const marginCard = useBreakpointValue({ base: 8, md: 16 });
  const { t } = useTranslation(lng);

  return (
    <Flex p={4} gap={6} position='relative' id='last-products' overflowX='hidden'>
      <CarouselContextProvider>
        <Carousel
          i18n='cards'
          header={
            <Heading size='lg' mb={4}>
              {t('newProducts')}
            </Heading>
          }
          paginationButtonStyles={{ cursor: 'pointer', marginBottom: '10px' }}
          cardWidth={445}
          marginCard={marginCard}
          defaultActivePage={1}
          cards={products.map(card => ({ ...card, key: card.id + card.title }))}
          noCardsText='No cards selected'
          CustomArrowBtn={<CustomArrowsPreview />}
        >
          <Card lng={lng} />
        </Carousel>
      </CarouselContextProvider>
    </Flex>
  );
}
