'use client';

import React, { useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import { fetchSearchProducts } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { Box, Flex, Image, Input, Spinner, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const SearchView: React.FC<{ lng: string; query: string; products: IProductResponse[] }> = ({
  lng,
  query,
  products,
}) => {
  const { t } = useTranslation(lng);
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<IProductResponse[]>(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() || searchQuery === query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res: IProductResponse[] = await fetchSearchProducts(searchQuery);

        setResults(res ?? []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <Layout lng={lng}>
      <Box maxW='container.md' mx='auto' mt={8} px={4}>
        <Text fontSize='2xl' fontWeight='bold'>
          {t('search.resultsFor')}{' '}
          <Text as='span' color='blue.600'>
            &#34;{searchQuery}&#34;
          </Text>
        </Text>

        <Flex mt={4} align='center' border='1px solid gray' borderRadius='md' px={3} py={2} bg='white'>
          <LuSearch size={20} color='gray' />
          <Input
            type='text'
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            border='none'
            _focus={{ outline: 'none' }}
            ml={2}
          />
        </Flex>

        <Box mt={6}>
          {loading && <Spinner size='lg' />}

          {!loading && results.length === 0 && (
            <Text color='gray.500' mt={4}>
              {t('search.noResults', { query: searchQuery })}
            </Text>
          )}

          {!loading &&
            results?.map(product => (
              <Flex
                key={product.id}
                p={3}
                align='center'
                gap={3}
                cursor='pointer'
                borderBottom='1px solid gray'
                _hover={{ bg: 'gray.100' }}
                onClick={() => (window.location.href = `/${lng}/product/${product.id}`)}
              >
                <Image
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.title}
                  boxSize='60px'
                  borderRadius='md'
                />
                <Box>
                  <Text fontSize='lg' fontWeight='bold'>
                    {product.title}
                  </Text>
                  {product.price && (
                    <Text fontSize='sm' color='gray.600'>
                      ${product.price.toFixed(2)}
                    </Text>
                  )}
                  {product.brand && (
                    <Text fontSize='sm' color='gray.500'>
                      {product.brand}
                    </Text>
                  )}
                </Box>
              </Flex>
            ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default SearchView;
