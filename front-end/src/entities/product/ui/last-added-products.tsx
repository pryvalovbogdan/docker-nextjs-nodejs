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
  title_ru,
}: {
  style?: any;
  name?: string;
  title?: string;
  images?: string[];
  maxWidth?: string;
  title_ru?: string;
  width?: string;
  id?: string;
  lng: string;
}) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/${lng}/product/${id}`);
  };

  const titleByLang = lng === 'ru' ? title_ru : title;

  return (
    <Flex
      direction='column'
      boxShadow='md'
      borderRadius='lg'
      bg='white'
      overflow='hidden'
      align='center'
      cursor='pointer'
      transition='all 0.3s'
      _hover={{
        boxShadow: 'lg',
        transform: 'scale(1.05)',
        borderColor: '#036753',
      }}
      onClick={handleRedirect}
      {...style}
    >
      <Box w='100%' display='flex' alignItems='center' justifyContent='center' bg='white'>
        <Image
          src={images?.[0] || '/placeholder.webp'}
          alt={name}
          objectFit='contain'
          maxW={maxWidth}
          h='250px'
          mt='20px'
          w={width}
          borderRadius='lg'
        />
      </Box>
      <Box p={4} textAlign='center' bg='gray.50' w='100%'>
        <Heading size='md' color='gray.800'>
          {titleByLang}
        </Heading>
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
        bg='#036753'
        color='white'
        borderRadius='full'
        transition='background 0.3s ease-in-out'
        _hover={{ bg: '#024D3E' }}
        _active={{ bg: '#02372A' }}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        zIndex={99}
      >
        <LuChevronLeft size={24} />
      </IconButton>
      <IconButton
        aria-label='Next slide'
        position='absolute'
        right='10px'
        top='50%'
        transform='translateY(-50%)'
        bg='#036753'
        color='white'
        borderRadius='full'
        transition='background 0.3s ease-in-out'
        _hover={{ bg: '#024D3E' }}
        _active={{ bg: '#02372A' }}
        onClick={handleNextPage}
        disabled={currentPage === totalPageCount}
        zIndex={99}
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
    <Box p={10} id='last-products' bg='gray.50'>
      <Heading size='lg' mb={6} textAlign='center' color='gray.800' fontSize='36px'>
        {t('newProducts')}
      </Heading>

      <Flex position='relative' overflowX='hidden'>
        <CarouselContextProvider>
          <Carousel
            i18n='cards'
            paginationButtonStyles={{ cursor: 'pointer', marginBottom: '10px' }}
            cardWidth={445}
            marginCard={marginCard}
            defaultActivePage={1}
            cards={products.map(card => ({ ...card, key: card.id + card.title }))}
            noCardsText={t('noProductsInThisList')}
            CustomArrowBtn={<CustomArrowsPreview />}
          >
            <Card lng={lng} />
          </Carousel>
        </CarouselContextProvider>
      </Flex>
    </Box>
  );
}
