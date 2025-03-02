'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuMenu, LuX } from 'react-icons/lu';

import { ICategoryResponse } from '@/entities/category/model/types';
import { fetchProductByCategoryUi } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '@/shared/ui/accordion';
import { Button, Flex, Grid, Heading, IconButton, Image, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

export default function Gallery({
  products,
  categories,
  lng,
}: {
  products: IProductResponse[];
  categories: ICategoryResponse[];
  lng: string;
}) {
  const subDefault = categories[0].subCategories?.[0] ? categories[0].subCategories[0].name : '';
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].name);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(subDefault);
  const [productState, setProducts] = useState<{ [key: string]: IProductResponse[] }>({
    [categories[0].name]: products,
  });
  const [loading, setLoading] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null as any);

  const isMobile = useIsMobile(768);
  const { t } = useTranslation(lng);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const filteredProducts =
    productState[selectedCategory]?.filter(product => {
      return product.subCategory?.name && selectedSubCategory
        ? product.subCategory?.name === selectedSubCategory
        : true;
    }) || [];

  const selectCategory = async (name: string, subCategories?: { id: number; name: string }[]) => {
    setSelectedCategory(name);
    setSelectedSubCategory('');

    if (subCategories?.length) {
      setSelectedSubCategory(subCategories[0].name);
    }

    if (productState[name]) return;

    setLoading(true);

    const fetchedProducts: IProductResponse[] = await fetchProductByCategoryUi(name);

    setProducts(prev => ({
      ...prev,
      [name]: fetchedProducts,
    }));

    setLoading(false);
  };

  const router = useRouter();

  const renderProducts = () => {
    if (loading) {
      return <Spinner size='xl' color='#036753' />;
    }

    if (filteredProducts.length > 0) {
      return filteredProducts.map(product => (
        <Flex
          key={product.id}
          borderWidth={1}
          p={4}
          borderRadius='lg'
          shadow='md'
          w='100%'
          maxWidth={isMobile ? '100%' : '320px'}
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
          maxHeight='300px'
          display='flex'
          justifyContent='space-between'
        >
          {product.images && product.images.length > 0 && (
            <Image
              src={product.images[0] || '/placeholder.webp'}
              alt={product.title}
              mb={2}
              borderRadius='md'
              height='150px'
              objectFit='cover'
            />
          )}
          <Heading size='sm' color='gray.700' textAlign='center'>
            {product.title}
          </Heading>
          {product.description && (
            <Text
              fontSize='sm'
              mt={2}
              color='gray.500'
              noOfLines={5}
              overflow='hidden'
              textOverflow='ellipsis'
              display='-webkit-box'
            >
              {product.description}
            </Text>
          )}
        </Flex>
      ));
    }

    return (
      <Text fontSize='lg' color='gray.600'>
        {t('noProducts')}
      </Text>
    );
  };

  return (
    <Flex p={6} gap={6} position='relative' id='categories'>
      {isMobile && (
        <IconButton
          aria-label='Open categories'
          color='white'
          bg='#036753'
          _hover={{ bg: '#045D45' }}
          onClick={() => setShowMenu(!showMenu)}
          position='absolute'
          variant='solid'
          top={2}
          left={2}
          boxShadow='lg'
          zIndex={100}
        >
          {showMenu ? <LuX /> : <LuMenu />}
        </IconButton>
      )}

      <VStack
        ref={menuRef}
        align='start'
        w='250px'
        bg='white'
        borderRadius='lg'
        borderWidth='1px'
        borderColor='gray.300'
        boxShadow='lg'
        p={4}
        zIndex={100}
        display={isMobile && !showMenu ? 'none' : 'flex'}
        position={isMobile ? 'absolute' : 'initial'}
        left='8px'
        top='50px'
      >
        <Heading size='md' color='gray.700'>
          {t('categories')}
        </Heading>
        <Stack gap='4' w='full'>
          <AccordionRoot variant='plain' collapsible defaultValue={[categories[0].name]}>
            {categories.map(category => (
              <AccordionItem key={category.name} value={category.name} w='full'>
                <AccordionItemTrigger
                  bg={selectedCategory === category.name ? '#036753' : 'gray.100'}
                  color={selectedCategory === category.name ? 'white' : 'gray.700'}
                  _hover={{ bg: '#045D45', color: 'white' }}
                  px={4}
                  py={3}
                  borderRadius='md'
                  fontWeight='bold'
                  onClick={() => selectCategory(category.name, category.subCategories)}
                >
                  {category.name}
                  {category.subCategories?.length ? <LuChevronDown /> : null}
                </AccordionItemTrigger>
                <AccordionItemContent p={0}>
                  <VStack align='start' w='full'>
                    {category.subCategories?.map(sub => (
                      <Button
                        key={sub.name}
                        variant='ghost'
                        fontWeight={selectedSubCategory === sub.name ? 'bold' : 'normal'}
                        color={selectedSubCategory === sub.name ? '#036753' : 'gray.700'}
                        justifyContent='flex-start'
                        w='250px'
                        _hover={{ bg: 'gray.200' }}
                        onClick={() => setSelectedSubCategory(sub.name)}
                        whiteSpace='nowrap'
                        overflow='hidden'
                        textOverflow='ellipsis'
                      >
                        {sub.name}
                      </Button>
                    ))}
                  </VStack>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Stack>
      </VStack>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        gap={6}
        w='100%'
        alignItems='stretch'
        justifyContent='center'
        gridAutoRows='min-content'
      >
        {renderProducts()}
      </Grid>
    </Flex>
  );
}
