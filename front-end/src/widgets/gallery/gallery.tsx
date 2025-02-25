'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuMenu, LuX } from 'react-icons/lu';

import { ICategoryResponse, ISubCategoryResponse } from '@/entities/category/model/types';
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
  const subDefault = categories[0].subCategories[0] ? categories[0].subCategories[0].name : '';
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].name);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(subDefault);
  const [productState, setProducts] = useState<{ [key: string]: IProductResponse[] }>({
    [categories[0].name]: products,
  });
  const [loading, setLoading] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null as HTMLDivElement);

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
    setSelectedSubCategory(null);

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

  const renderProducts = () => {
    if (loading) {
      return <Spinner size='xl' />;
    }

    if (filteredProducts.length > 0) {
      return filteredProducts.map(product => (
        <Flex
          key={product.id}
          borderWidth={1}
          p={4}
          borderRadius='md'
          shadow='md'
          w='100%'
          maxWidth={isMobile ? '100%' : '300px'}
          alignItems='center'
          flexDirection='column'
        >
          {product.images && product.images.length > 0 && (
            <Image
              src={product.images[0]}
              alt={product.title}
              mb={2}
              borderRadius='md'
              height='200px'
              objectFit='cover'
            />
          )}
          <Heading size='sm'>{product.title}</Heading>
          {product.description && (
            <Text fontSize='sm' mt={2}>
              {product.description}
            </Text>
          )}
        </Flex>
      ));
    }

    return <Text fontSize='lg'>{t('noProducts')}</Text>;
  };

  return (
    <Flex p={4} gap={6} position='relative' id='categories'>
      {isMobile && (
        <IconButton
          aria-label='Open categories'
          color='black'
          onClick={() => setShowMenu(!showMenu)}
          position='absolute'
          top={2}
          left={2}
          zIndex={100}
        >
          {showMenu ? <LuX /> : <LuMenu />}
        </IconButton>
      )}

      <VStack
        ref={menuRef}
        align='start'
        w='250px'
        spacing={2}
        position={isMobile ? 'absolute' : 'static'}
        top={isMobile ? '50px' : 'auto'}
        left={isMobile ? '0' : 'auto'}
        bg='white'
        boxShadow={isMobile ? 'lg' : 'none'}
        p={isMobile ? 4 : 0}
        borderRadius='md'
        zIndex={100}
        display={isMobile && !showMenu ? 'none' : 'flex'}
      >
        <Heading size='md'>{t('categories')}</Heading>
        <Stack gap='4' w='full'>
          <AccordionRoot variant='plain' collapsible defaultValue={categories[0].name}>
            {categories.map(category => (
              <AccordionItem key={category.name} value={category.name} w='full'>
                <AccordionItemTrigger
                  bg={selectedCategory === category.name ? 'steelblue' : 'gray.200'}
                  color={selectedCategory === category.name ? 'white' : 'black'}
                  _hover={{ bg: 'steelblue' }}
                  px={4}
                  py={2}
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  onClick={() => selectCategory(category.name, category.subCategories)}
                >
                  {category.name}
                  {category.subCategories && category.subCategories.length > 0 && <LuChevronDown />}
                </AccordionItemTrigger>
                <AccordionItemContent p={0} boxShadow='md' borderRadius='md'>
                  <VStack align='start' w='full' bg='white' spacing={0} borderRadius='md'>
                    {category.subCategories && category.subCategories.length > 0 ? (
                      category.subCategories.map((sub: ISubCategoryResponse) => (
                        <Button
                          key={sub.name}
                          variant='ghost'
                          color={selectedSubCategory === sub.name ? 'steelblue' : 'black'}
                          fontWeight={selectedSubCategory === sub.name ? 'bold' : 'normal'}
                          justifyContent='flex-start'
                          minW='max-content'
                          px={4}
                          py={2}
                          w='full'
                          textAlign='left'
                          borderRadius='md'
                          boxShadow='md'
                          _hover={{ bg: 'gray.300' }}
                          onClick={() => setSelectedSubCategory(sub.name)}
                        >
                          {sub.name}
                        </Button>
                      ))
                    ) : (
                      <Text fontSize='sm' color='gray.600' p={4}>
                        {t('noSubcategories')}
                      </Text>
                    )}
                  </VStack>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Stack>
      </VStack>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(250px, 300px))' }}
        gap={6}
        justifyContent='start'
        width='100%'
      >
        {renderProducts()}
      </Grid>
    </Flex>
  );
}
