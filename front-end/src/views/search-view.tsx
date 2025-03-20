'use client';

import React, { useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import { fetchSearchProducts } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { Box, Flex, Image, Input, Spinner, Text } from '@chakra-ui/react';
import { ContactButton } from '@features/contact';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const DEBOUNCE_DELAY = 500;

const SearchView: React.FC<{ lng: string; query: string; products: IProductResponse[] }> = ({
  lng,
  query,
  products,
}) => {
  const { t } = useTranslation(lng);
  const [searchQuery, setSearchQuery] = useState(decodeURIComponent(query));
  const [results, setResults] = useState<IProductResponse[]>(products);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res: IProductResponse[] = await fetchSearchProducts(debouncedQuery);

        setResults(res ?? []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <Layout lng={lng}>
      <Box maxW='container.md' mx='auto' my={8} px={4}>
        <Text fontSize='2xl' fontWeight='bold' textAlign='center' color='gray.800'>
          {t('search.resultsFor')}{' '}
          <Text as='span' color='#036753'>
            &#34;{searchQuery}&#34;
          </Text>
        </Text>

        <Flex
          mt={4}
          align='center'
          border='1px solid rgba(3, 103, 83, 0.5)'
          borderRadius='full'
          px={3}
          py={2}
          bg='rgba(255, 255, 255, 0.9)'
          boxShadow='lg'
          backdropFilter='blur(10px)'
          transition='all 0.3s'
          _hover={{ boxShadow: 'xl', borderColor: '#024D3E' }}
        >
          <LuSearch size={20} color='#036753' />
          <Input
            type='text'
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            border='none'
            _focus={{ outline: 'none', boxShadow: '0 0 5px rgba(3, 103, 83, 0.5)' }}
            ml={2}
            color='gray.800'
          />
        </Flex>

        <Box mt={6}>
          {loading && <Spinner size='lg' color='#036753' />}

          {!loading && results.length === 0 && (
            <Text color='gray.500' mt={4} textAlign='center'>
              {t('search.noResults', { query: searchQuery })}
            </Text>
          )}

          {!loading &&
            results?.map(product => (
              <Flex
                key={product.id}
                p={4}
                align='center'
                gap={4}
                cursor='pointer'
                borderRadius='lg'
                bg='white'
                boxShadow='md'
                transition='all 0.3s'
                _hover={{ boxShadow: 'xl', transform: 'scale(1.02)', borderColor: '#036753' }}
                onClick={() => {
                  window.location.href = `/${lng}/product/${product.id}`;
                }}
              >
                <Image
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.title}
                  boxSize='70px'
                  borderRadius='md'
                  objectFit='cover'
                />
                <Box>
                  <Text fontSize='lg' fontWeight='bold' color='gray.800'>
                    {product.title}
                  </Text>
                  {product.price && (
                    <Text fontSize='md' fontWeight='semibold' color='#036753'>
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
      <ContactButton lng={lng} />
    </Layout>
  );
};

export default SearchView;
