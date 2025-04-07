'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Carousel, CarouselContextProvider, useCarouselContext } from 'react-carousel-cards-npm';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { brandData } from '@/shared/utils/data';
import { Box, Button, Flex, Heading, IconButton, Image, useBreakpointValue } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

interface IBrandCard {
  style?: any;
  name?: string;
  src?: string;
  alt?: string;
  lng: string;
  description?: string;
}
const BrandCard = ({ style, name, src, alt, lng, description }: IBrandCard) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/${lng}/brand/${name}`);
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
      transition='all 0.3s'
      my={2}
      flex='1'
      _hover={{ boxShadow: 'lg', transform: 'scale(1.05)', borderColor: '#036753' }}
      onClick={handleRedirect}
      {...style}
    >
      <Box w='100%' display='flex' alignItems='center' justifyContent='center' bg='white' p={4}>
        <Image src={src} alt={alt} objectFit='contain' boxSize='120px' />
      </Box>
      <Box
        p={4}
        textAlign='center'
        bg='gray.50'
        w='100%'
        flex='1'
        display='flex'
        flexDirection='column'
        justifyContent='center'
      >
        <Heading size='md' color='gray.800'>
          {name}
        </Heading>
        <div
          style={{
            color: '#4B5563',
            fontSize: '0.875rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '3em',
          }}
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
                 ${description?.slice(0, 250)}
               </div>
             `,
          }}
        />
      </Box>
    </Flex>
  );
};

const CustomArrows = () => {
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

const CustomPaginationBtn = () => {
  const { currentPage, totalPageCount, onCurrentPage } = useCarouselContext();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const MAX_VISIBLE_PAGES = isMobile ? 4 : 8;

  if (!currentPage || !totalPageCount) return null;

  const getPaginationRange = () => {
    const pages: (number | string)[] = [];

    if (totalPageCount <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    const sidePages = Math.floor((MAX_VISIBLE_PAGES - 2) / 2);
    const startPage = Math.max(2, currentPage - sidePages);
    const endPage = Math.min(totalPageCount - 1, currentPage + sidePages);

    if (startPage > 2) {
      pages.push(1, '...');
    } else {
      pages.push(1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPageCount - 1) {
      pages.push('...', totalPageCount);
    } else {
      pages.push(totalPageCount);
    }

    return pages;
  };

  const paginationRange = getPaginationRange();

  return (
    <Flex justify='center' mt={4} gap={2}>
      {paginationRange.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={page}
            onClick={() => onCurrentPage(page as number)}
            bg={currentPage === page ? 'white' : 'emerald.800'}
            color={currentPage === page ? 'emerald.700' : 'white'}
            fontWeight='bold'
            border={currentPage === page ? '2px solid' : 'none'}
            borderColor={currentPage === page ? 'emerald.700' : 'transparent'}
            boxShadow={currentPage === page ? 'md' : 'none'}
            _hover={{
              bg: currentPage === page ? 'white' : 'emerald.600',
              color: currentPage === page ? 'emerald.800' : 'white',
            }}
            borderRadius='md'
            px={4}
            py={2}
          >
            {page}
          </Button>
        ) : (
          <Box key={`ellipsis-${index}`} px={2} color='gray.500'>
            ...
          </Box>
        ),
      )}
    </Flex>
  );
};

const BrandsCarousel = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);

  return (
    <Box as='section' id='brands' py={20} bg='white'>
      <Heading as='h3' fontSize='36px' textAlign='center' mb={10}>
        {t('brands')}
      </Heading>

      <Flex position='relative' overflowX='hidden' mx={5} px={1}>
        <CarouselContextProvider>
          <Flex flexDirection='column' flex={1} w='100%'>
            <Carousel
              i18n='brands'
              paginationButtonStyles={{ cursor: 'pointer', marginBottom: '10px' }}
              cardWidth={300}
              marginCard={16}
              defaultActivePage={1}
              cards={brandData.map(brand => ({ ...brand, key: brand.name }))}
              noCardsText='No brands available'
              CustomArrowBtn={<CustomArrows />}
              variant={['withoutPagination']}
            >
              <BrandCard lng={lng} />
            </Carousel>
            <CustomPaginationBtn />
          </Flex>
        </CarouselContextProvider>
      </Flex>
    </Box>
  );
};

export default BrandsCarousel;
