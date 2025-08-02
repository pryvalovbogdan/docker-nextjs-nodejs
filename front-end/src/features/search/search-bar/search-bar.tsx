import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import { fetchSearchProducts } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { Box, Flex, Image, Input, Kbd, Spinner, Text } from '@chakra-ui/react';
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
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchResults]);

  const handleSearch = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/${lng}/find/${encodeURIComponent(searchQuery).replace(/ /g, '+').replace(/%20/g, '+')}`);
    }
  };

  return (
    <Box position='relative' width='100%'>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flex
          align='center'
          bg='white'
          borderRadius='full'
          px={4}
          py={2}
          width='100%'
          boxShadow='md'
          border='1px solid'
          borderColor='gray.300'
          transition='border-color 0.2s, box-shadow 0.2s'
          _hover={{ borderColor: '#036753' }}
          _focusWithin={{
            borderColor: '#036753',
            boxShadow: '0 0 5px rgba(3, 103, 83, 0.5)',
          }}
        >
          <Box mr={2}>
            <LuSearch color='#036753' size={18} onClick={handleSearch as any} cursor='pointer' />
          </Box>
          <Input
            type='text'
            h='25px'
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            bg='transparent'
            border='none'
            outline='none'
            px={2}
            width='100%'
            fontSize='md'
            color='gray.800'
            _focus={{ outline: 'none' }}
          />
          <Box ml={2} onClick={handleSearch}>
            <Kbd color='gray.600' fontSize='xs'>
              ⌘K
            </Kbd>
          </Box>
        </Flex>
      </form>

      {showDropdown && results.length > 0 && (
        <Box
          position='absolute'
          top='50px'
          left='0'
          width='100%'
          bg='white'
          border='1px solid gray.200'
          borderRadius='lg'
          boxShadow='lg'
          zIndex='1000'
          maxH='250px'
          overflowY='auto'
          transition='all 0.3s'
          p={2}
        >
          {loading && (
            <Flex align='center' justify='center' py={2}>
              <Spinner size='sm' color='#036753' />
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
                borderRadius='md'
                transition='all 0.2s'
                onMouseDown={() => router.push(`/${lng}/product/${product.id}`)}
              >
                <Image
                  src={product.images?.[0] || '/placeholder.webp'}
                  alt={product.title}
                  boxSize='40px'
                  borderRadius='md'
                />

                <Box>
                  <Text fontSize='sm' fontWeight='bold' color='gray.800'>
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
