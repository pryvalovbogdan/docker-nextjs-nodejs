'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuMenu, LuX } from 'react-icons/lu';

import { ICategoryResponse } from '@/entities/category/model/types';
import { fetchProductByCategoryUi, fetchProductsOffSet } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot, Pagination } from '@/shared/ui';
import { getInnerText } from '@/shared/utils';
import { Button, Flex, Grid, Heading, IconButton, Image, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const ITEMS_PER_PAGE_DESKTOP = 12;
const ITEMS_PER_PAGE_MOBILE = 4;

export default function Catalog({
  products,
  categories,
  lng,
}: {
  products: {
    data: IProductResponse[];
    totalPages: number;
  };
  categories: ICategoryResponse[];
  lng: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('default');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [productState, setProducts] = useState<{
    [key: string]: IProductResponse[] | { [key: string]: IProductResponse[] };
  }>({
    default: { 1: products.data },
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string[]>();
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null as any);

  const isMobile = useIsMobile();
  const router = useRouter();
  const { t } = useTranslation(lng);

  const itemsPerScreen = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;

  const searchParams = useSearchParams();

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

  const selectCategory = async (name: string, subCategories?: { id: number; name: string }[]) => {
    try {
      setSelectedCategory(name);
      setSelectedSubCategory('');
      setCurrentPage(1);

      if (subCategories?.length) {
        setSelectedSubCategory(subCategories[0].name);
      }

      if (productState[name]?.length) return;

      setLoading(true);
      const fetchedProducts: IProductResponse[] = await fetchProductByCategoryUi(name);

      setProducts(prev => ({
        ...prev,
        [name]: fetchedProducts,
      }));
    } catch (e) {
      console.log('Failed to load category', e);
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryData = productState[selectedCategory];

  const filteredProducts =
    selectedCategory !== 'default' && Array.isArray(currentCategoryData) && currentCategoryData.length
      ? currentCategoryData.filter(product =>
          selectedSubCategory ? product.subCategory?.name === selectedSubCategory : true,
        )
      : [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerScreen);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerScreen, currentPage * itemsPerScreen);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      const offsetTop = section.getBoundingClientRect().top + window.scrollY - 70;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const fetchData = async (page = 1): Promise<void> => {
    const token = sessionStorage.getItem('token') || '';

    try {
      const defaultState = productState.default;

      if (!Array.isArray(defaultState) && defaultState[page]) {
        setCurrentPage(page);

        return;
      }

      setLoading(true);
      const response = await fetchProductsOffSet(token, page, itemsPerScreen);

      if (response.success) {
        setProducts(prev => ({
          ...prev,
          default: {
            ...(Array.isArray(prev.default) ? { 1: prev.default } : prev.default),
            [page]: response.products,
          },
        }));

        setCurrentPage(page);
      }
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  const setShadowParams = (name: string, value: string, clearParams?: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    clearParams?.forEach(param => params.delete(param));

    params.set(name, value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const page = searchParams.get('gallerypage');

    if (category) {
      const subCategory = categories.find(item => item.name === category)?.subCategories?.[0]?.name;

      selectCategory(category);

      if (subCategory) {
        setSelectedSubCategory(subCategory);
      }

      setOpenAccordion([category]);
    }

    if (subcategory) {
      setSelectedSubCategory(subcategory);
    }

    if (page) {
      if (selectedCategory === 'default') {
        fetchData(Number(page));
      } else {
        setCurrentPage(Number(page));
      }
    }
  }, []);

  const renderProducts = () => {
    if (paginatedProducts.length > 0) {
      return paginatedProducts.map(product => (
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
          height='280px'
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
              whiteSpace={isMobile ? 'normal' : 'nowrap'}
              overflow='hidden'
              textOverflow='ellipsis'
              maxWidth='100%'
              display='block'
            >
              {product.description ? getInnerText(product.description).slice(0, 150) : product.characteristics}
            </Text>
          )}
        </Flex>
      ));
    }

    const defaultCategory = productState.default;

    if (!Array.isArray(defaultCategory) && defaultCategory[currentPage]?.length > 0 && selectedCategory === 'default') {
      const productsPerScreen = isMobile ? defaultCategory[currentPage]?.slice(0, 4) : defaultCategory[currentPage];

      return productsPerScreen?.map(product => (
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
          height='280px'
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
              whiteSpace={isMobile ? 'normal' : 'nowrap'}
              overflow='hidden'
              textOverflow='ellipsis'
              maxWidth='100%'
              display='block'
            >
              {product.description ? getInnerText(product.description).slice(0, 150) : product.characteristics}
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
          <AccordionRoot variant='plain' collapsible value={openAccordion}>
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
                  my={2}
                  onClick={() => {
                    const clearParams = ['gallerypage', 'subcategory'];

                    if (selectedCategory === category.name) {
                      clearParams.push('category', 'subcategory');
                      setShadowParams('', '', clearParams);
                      setCurrentPage(1);
                      setSelectedCategory('default');
                      setSelectedSubCategory('');

                      setOpenAccordion([]);
                    } else {
                      selectCategory(category.name, category.subCategories);

                      if (!category.subCategories?.length) {
                        clearParams.push('subcategory');
                      }

                      setShadowParams('category', category.name, clearParams);
                      setOpenAccordion([category.name]);
                    }
                  }}
                >
                  <Flex justifyContent='space-between' w='100%' alignItems='baseline'>
                    {category.name}
                    {category.subCategories?.length ? (
                      <Text ml={1} minWidth='15px'>
                        <LuChevronDown />
                      </Text>
                    ) : null}
                  </Flex>
                </AccordionItemTrigger>
                <AccordionItemContent p={0}>
                  <VStack align='start' w='full'>
                    {openAccordion?.includes(category.name) &&
                      category.subCategories?.map(sub => (
                        <Button
                          key={sub.name}
                          variant='ghost'
                          fontWeight={selectedSubCategory === sub.name ? 'bold' : 'normal'}
                          color={selectedSubCategory === sub.name ? '#036753' : 'gray.700'}
                          justifyContent='flex-start'
                          w='250px'
                          _hover={{ bg: 'gray.200' }}
                          onClick={() => {
                            setSelectedSubCategory(sub.name);
                            setCurrentPage(1);

                            setShadowParams('subcategory', sub.name, ['gallerypage']);

                            if (isMobile) {
                              setShowMenu(false);
                            }
                          }}
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
      <Flex gap={6} flexDirection='column' w='100%'>
        {loading ? (
          <Flex h='888px' w='100%' justifyContent='center' alignItems='center'>
            <Spinner size='xl' color='#036753' />
          </Flex>
        ) : (
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
        )}

        {filteredProducts.length > itemsPerScreen && (
          <Pagination
            handlePageChange={page => {
              setCurrentPage(page);
              scrollToSection('categories');

              setShadowParams('gallerypage', page.toString());
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            isMobile={isMobile}
          />
        )}

        {selectedCategory === 'default' && (
          <Pagination
            handlePageChange={page => {
              fetchData(page);
              scrollToSection('categories');

              setShadowParams('gallerypage', page.toString());
            }}
            currentPage={currentPage}
            totalPages={products.totalPages}
            isMobile={isMobile}
          />
        )}
      </Flex>
    </Flex>
  );
}
