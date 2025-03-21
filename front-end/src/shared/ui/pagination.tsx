import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

import { Button, Flex, IconButton, Text } from '@chakra-ui/react';

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  isMobile?: boolean;
}

const Pagination = ({ totalPages, currentPage, handlePageChange, isMobile }: IPaginationProps) => {
  const MAX_VISIBLE_PAGES = isMobile ? 4 : 10;
  let pages: (number | string)[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (isMobile) {
    const sidePages = Math.floor((MAX_VISIBLE_PAGES - 2) / 2);
    let startPage = currentPage - sidePages;
    let endPage = currentPage + sidePages;

    if (startPage < 2) {
      startPage = 2;
      endPage = startPage + MAX_VISIBLE_PAGES - 3;
    }

    if (endPage > totalPages - 1) {
      endPage = totalPages - 1;
      startPage = endPage - (MAX_VISIBLE_PAGES - 3);

      if (startPage < 2) startPage = 2;
    }

    pages.push(1);

    if (startPage > 2) pages.push('...');

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push('...');

    pages.push(totalPages);
  } else {
    const startPage = Math.max(2, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    const endPage = Math.min(totalPages - 1, startPage + MAX_VISIBLE_PAGES - 3);

    if (startPage > 2) {
      pages.push(1, '...');
    } else {
      pages.push(1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...', totalPages);
    } else {
      pages.push(totalPages);
    }
  }

  return (
    <Flex justify='center' align='center' mt={6} gap={2} fontWeight='bold'>
      <IconButton
        aria-label='Previous Page'
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        bg='emerald.800'
        color='white'
        _hover={{ bg: 'emerald.600' }}
        _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}
      >
        <AiOutlineLeft />
      </IconButton>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            bg={currentPage === page ? 'emerald.700' : 'emerald.800'}
            color='white'
            _hover={{ bg: 'emerald.600' }}
            _selected={{ bg: 'emerald.700', color: 'white' }}
          >
            {page}
          </Button>
        ) : (
          <Text key={`ellipsis-${index}`} color='gray.500' px={2}>
            ...
          </Text>
        ),
      )}

      <IconButton
        aria-label='Next Page'
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        bg='emerald.800'
        color='white'
        _hover={{ bg: 'emerald.600' }}
        _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}
      >
        <AiOutlineRight />
      </IconButton>
    </Flex>
  );
};

export default Pagination;
