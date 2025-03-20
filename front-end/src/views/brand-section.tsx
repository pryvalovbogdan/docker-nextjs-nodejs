'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Carousel, CarouselContextProvider, useCarouselContext } from 'react-carousel-cards-npm';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { brandData } from '@/shared/utils/data';
import { Box, Button, Flex, Heading, IconButton, Image, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

interface IBrandCard {
  style?: any;
  name?: string;
  src?: string;
  alt?: string;
  lng: string;
}
const BrandCard = ({ style, name, src, alt, lng }: IBrandCard) => {
  const router = useRouter();
  const { t } = useTranslation(lng);

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
        <Text
          fontSize='sm'
          color='gray.600'
          mt={1}
          maxHeight='3em'
          overflow='hidden'
          textOverflow='ellipsis'
          display='-webkit-box'
          style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {t(name?.toLowerCase() as any)}
        </Text>
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

  return (
    <Flex justify='center' mt={4} gap={2}>
      {[...Array(totalPageCount)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <Button
            key={pageNumber}
            onClick={() => onCurrentPage(pageNumber)}
            bg={currentPage === pageNumber ? 'emerald.600' : 'emerald.800'}
            color='white'
            _hover={{ bg: 'emerald.500' }}
            _selected={{ bg: 'emerald.700', color: 'white' }}
            borderRadius='md'
            px={4}
            py={2}
          >
            {pageNumber}
          </Button>
        );
      })}
    </Flex>
  );
};

const BrandsSection = ({ lng }: { lng: string }) => {
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
              cards={brandData.slice(0, 9).map(brand => ({ ...brand, key: brand.name }))}
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

export default BrandsSection;
