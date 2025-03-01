import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

import { Button, Flex, IconButton } from '@chakra-ui/react';

interface IPaginationProps {
  totalPages: number;
  handlePageChange: (page: number) => void;
  currentPage: number;
}
const Pagination = ({ handlePageChange, currentPage, totalPages }: IPaginationProps) => {
  return (
    <Flex justify='center' align='center' mt={4} gap={2} fontWeight='bold'>
      <IconButton
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label='Previous Page'
        bg='black'
        color='white'
        _hover={{ bg: 'gray.700' }}
        _disabled={{ bg: 'gray.500', cursor: 'not-allowed' }}
      >
        <AiOutlineLeft />
      </IconButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          bg={currentPage === page ? 'orange.400' : 'black'}
          color={currentPage === page ? 'black' : 'white'}
          _hover={{ bg: 'gray.700', color: 'white', opacity: 0.7 }}
          _selected={{ bg: 'orange.400', color: 'black' }}
        >
          {page}
        </Button>
      ))}

      <IconButton
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label='Next Page'
        bg='black'
        color='white'
        _hover={{ bg: 'gray.700' }}
        _disabled={{ bg: 'gray.500', cursor: 'not-allowed' }}
      >
        <AiOutlineRight />
      </IconButton>
    </Flex>
  );
};

export default Pagination;
