'use client';

import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

import { ICategoryResponse, ISubCategoryResponse } from '@/entities/category/model/types';
import { IProductResponse } from '@/entities/product/model/types';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '@/shared/ui/accordion';
import { Box, Button, Flex, Grid, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react';

export default function Gallery({
  products,
  categories,
}: {
  products: IProductResponse[];
  categories: ICategoryResponse[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categories.length > 0 ? categories[0].id : null,
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  const filteredProducts = products.filter(product =>
    selectedSubCategory ? product.subCategory?.id === selectedSubCategory : product.category.id === selectedCategory,
  );

  return (
    <Flex p={4} gap={6}>
      <VStack align='start' w='250px' spacing={2}>
        <Heading size='md'>Категорії</Heading>
        <Stack gap='4' w='full'>
          <AccordionRoot variant='plain' collapsible defaultValue={categories[0].name}>
            {categories.map((category, index) => (
              <AccordionItem key={index} value={category.name} w='full'>
                <AccordionItemTrigger
                  bg={selectedCategory === category.id ? 'steelblue' : 'gray.200'}
                  color={selectedCategory === category.id ? 'white' : 'black'}
                  _hover={{ bg: 'steelblue' }}
                  px={4}
                  py={2}
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedSubCategory(null);
                  }}
                >
                  {category.name}
                  {category.subCategories && category.subCategories.length > 0 && <LuChevronDown />}
                </AccordionItemTrigger>
                <AccordionItemContent p={0} boxShadow='md' borderRadius='md'>
                  <VStack align='start' w='full' bg='white' spacing={0} borderRadius='md'>
                    {category.subCategories && category.subCategories.length > 0 ? (
                      category.subCategories.map((sub: ISubCategoryResponse) => (
                        <Button
                          key={sub.id}
                          variant='ghost'
                          color={selectedSubCategory === sub.id ? 'steelblue' : 'black'}
                          fontWeight={selectedSubCategory === sub.id ? 'bold' : 'normal'}
                          justifyContent='flex-start'
                          minW='max-content'
                          px={4}
                          py={2}
                          w='full'
                          textAlign='left'
                          borderRadius='md'
                          boxShadow='md'
                          _hover={{ bg: 'gray.300' }}
                          onClick={() => setSelectedSubCategory(sub.id)}
                        >
                          {sub.name}
                        </Button>
                      ))
                    ) : (
                      <Text fontSize='sm' color='gray.600' p={4}>
                        Немає підкатегорій
                      </Text>
                    )}
                  </VStack>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Stack>
      </VStack>
      <Grid templateColumns='repeat(auto-fit, minmax(250px, 1fr))' gap={6} flex={1}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Box key={product.id} borderWidth={1} p={4} borderRadius='md' shadow='md'>
              {product.images && product.images.length > 0 && (
                <Image src={product.images[0]} alt={product.title} mb={2} borderRadius='md' />
              )}
              <Heading size='sm'>{product.title}</Heading>
              {product.description && (
                <Text fontSize='sm' mt={2}>
                  {product.description}
                </Text>
              )}
            </Box>
          ))
        ) : (
          <Text fontSize='lg'>Немає товарів у цій категорії</Text>
        )}
      </Grid>
    </Flex>
  );
}
