import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

import { Button, Flex, IconButton } from '@chakra-ui/react';

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, handlePageChange }: IPaginationProps) => {
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

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
      ))}

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
