import { Box, Button, Image, Text } from '@chakra-ui/react';

interface ProductProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

const ProductCard = ({ product }: ProductProps) => {
  return (
    <Box borderRadius='10px' boxShadow='lg' p={4}>
      <Image src={product.image} alt={product.name} objectFit='cover' boxSize='200px' mx='auto' />
      <Box textAlign='center' mt={4}>
        <Text fontSize='xl' fontWeight='bold'>
          {product.name}
        </Text>
        <Text color='gray.500'>${product.price}</Text>
        <Button mt={2} colorScheme='blue'>
          Buy Now
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
