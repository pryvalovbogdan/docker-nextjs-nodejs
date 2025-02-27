import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import { fetchSearchProducts } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { Box, Flex, Group, Image, Input, InputElement, Kbd, Spinner, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const SearchBar: React.FC<{ lng: string }> = ({ lng }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const { t } = useTranslation(lng);

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);

      return;
    }

    setLoading(true);
    try {
      const res: IProductResponse[] = await fetchSearchProducts(query);

      setResults(res ?? []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchResults]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/${lng}/find/${searchQuery}`);
    }
  };

  return (
    <Box position='relative' width='100%'>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Box position='relative' flex='1'>
          <Group w='100%'>
            <InputElement>
              <LuSearch color='black' size={20} />
            </InputElement>
            <Input
              type='text'
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              bg='white'
              borderRadius='md'
              _hover={{ border: '1px solid blue.400' }}
              _focus={{ borderColor: 'blue.400', outline: 'none' }}
              px={10}
              py={2}
              width='100%'
            />
            <InputElement placement='end'>
              <Kbd>⌘K</Kbd>
            </InputElement>
          </Group>
        </Box>
      </form>

      {showDropdown && results.length > 0 && (
        <Box
          position='absolute'
          top='40px'
          left='0'
          width='100%'
          bg='white'
          border='1px solid gray'
          borderRadius='md'
          boxShadow='lg'
          zIndex='1000'
          maxH='250px'
          overflowY='auto'
        >
          {loading && (
            <Flex align='center' justify='center' py={2}>
              <Spinner size='sm' />
            </Flex>
          )}
          {!loading &&
            results.map(product => (
              <Flex
                key={product.id}
                p={2}
                align='center'
                gap={3}
                cursor='pointer'
                _hover={{ bg: 'gray.100' }}
                onMouseDown={() => router.push(`/${lng}/product/${product.id}`)}
              >
                <Image
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.title}
                  boxSize='40px'
                  borderRadius='md'
                />
                <Box>
                  <Text fontSize='sm' fontWeight='bold'>
                    {product.title}
                  </Text>
                  {product.price && (
                    <Text fontSize='xs' color='gray.600'>
                      ${product.price.toFixed(2)}
                    </Text>
                  )}
                  {product.brand && (
                    <Text fontSize='xs' color='gray.500'>
                      {t('search.brand', { brand: product.brand })}
                    </Text>
                  )}
                </Box>
              </Flex>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
