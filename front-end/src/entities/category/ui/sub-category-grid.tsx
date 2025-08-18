import Link from 'next/link';

import { ICategoryResponse } from '@/entities/category/model/types';
import { IProductResponse } from '@/entities/product/model/types';
import { Box, Grid, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';

async function getProductCountLabel(count: number, lng: string): Promise<string> {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (!languages.includes(lng)) lng = fallbackLng;

  const { t } = await useTranslation(lng);

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ${t('item')}`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ${t('items')}`;
  }

  return `${count} ${t('itemsLeft')}`;
}

const SubCategoryGrid = ({
  subcategory,
  categories,
  products,
  lng,
  category,
}: {
  subcategory?: string;
  lng: string;
  category?: string;
  products: IProductResponse[];
  categories: ICategoryResponse[];
}) => {
  const categoryData = categories.find(item => item.path === category);

  const heading = subcategory
    ? categories.reduce((acc, item) => {
        const sub = item.subCategories && item.subCategories?.find(s => s?.path === subcategory);

        return sub ? sub.heading : acc;
      }, '')
    : categoryData?.heading;

  const subcategoryPreviews =
    !subcategory && categoryData?.subCategories
      ? categoryData.subCategories.map(sub => {
          const withImage = products.find(p => p.subCategory?.path === sub.path && p.images && p.images.length > 0);
          const anyProduct = withImage || products.find(p => p.subCategory?.path === sub.path) || null;

          const count = products.reduce((acc, p) => (p.subCategory?.path === sub.path ? acc + 1 : acc), 0);

          const imageSrc = (withImage?.images?.[0] as string | undefined) || '/placeholder.webp';
          const imageAlt = withImage?.title || anyProduct?.title || `${sub.name} — preview`;

          return {
            name: sub.name,
            path: sub.path,
            imageSrc,
            imageAlt,
            count,
          };
        })
      : [];

  return (
    <Box>
      <Box display='flex' alignItems='center' justifyContent='center'>
        <Heading as='h1' size='3xl' p={6}>
          {heading}
        </Heading>
      </Box>

      <Box w='100%' maxW='100%' px={0}>
        <Grid
          w='100%'
          maxW='100%'
          templateColumns={{
            base: 'repeat(auto-fill, minmax(140px, 1fr))',
            sm: 'repeat(auto-fill, minmax(170px, 1fr))',
            md: 'repeat(auto-fill, minmax(210px, 1fr))',
            lg: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}
          gap={{ base: 3, sm: 4, md: 5, lg: 6 }}
          alignItems='stretch'
          px={{ base: 3, md: 6 }}
          pb={subcategoryPreviews.length ? { base: 4, md: 8 } : {}}
        >
          {subcategoryPreviews.map(sub => (
            <Link
              key={sub.path}
              href={`/${lng}/categories/${category}/sub-category/${sub.path}`}
              aria-label={`Open subcategory ${sub.name}`}
            >
              <Box
                role='group'
                h='100%'
                display='flex'
                flexDirection='column'
                borderWidth='1px'
                borderColor='gray.200'
                borderRadius='lg'
                overflow='hidden'
                bg='white'
                boxShadow='md'
                _hover={{ boxShadow: 'lg', borderColor: '#036753' }}
                _focusWithin={{ boxShadow: 'outline' }}
                transition='all 0.2s ease'
              >
                <Box
                  h={{ base: '120px', sm: '140px', md: '160px' }}
                  bg='white'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  overflow='hidden'
                >
                  <Image
                    src={sub.imageSrc}
                    alt={sub.imageAlt}
                    loading='lazy'
                    objectFit='contain'
                    objectPosition='center'
                    maxH='100%'
                    maxW='100%'
                    w='auto'
                    h='auto'
                    fallbackSrc='/placeholder.webp'
                  />
                </Box>
                <VStack
                  align='start'
                  spacing={{ base: 1, md: 2 }}
                  p={{ base: 3, md: 4 }}
                  flex='1'
                  justify='space-between'
                >
                  <Box w='100%'>
                    <Text
                      as='span'
                      fontSize={{ base: 'md', md: 'lg' }}
                      fontWeight='bold'
                      color='black'
                      _groupHover={{ color: '#036753' }}
                      transition='color 0.2s ease'
                      noOfLines={2}
                    >
                      {sub.name}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.600' mt={2}>
                      {getProductCountLabel(sub.count, lng)}
                    </Text>
                    <Box
                      h='2px'
                      w='24px'
                      bg='#036753'
                      borderRadius='full'
                      transformOrigin='left'
                      transform='scaleX(0.6)'
                      _groupHover={{ transform: 'scaleX(1)' }}
                      transition='transform 0.2s ease'
                    />
                  </Box>
                </VStack>
              </Box>
            </Link>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SubCategoryGrid;
