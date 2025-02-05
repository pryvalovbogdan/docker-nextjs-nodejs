import ProductCard from '@/entities/brand/ui/product-card';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';

interface BrandProductsProps {
  products: any[];
  brandName: string;
}

const ProductsList = ({ products, brandName }: BrandProductsProps) => {
  return (
    <Box as='section' id='brand-products' py={20} bg='white'>
      <Heading as='h3' fontSize='48px' textAlign='center' mb={10}>
        {brandName} Products
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10} maxW='container.xl' mx='auto'>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProductsList;
