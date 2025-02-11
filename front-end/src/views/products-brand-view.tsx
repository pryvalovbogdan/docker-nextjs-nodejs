import ProductCard from '@/entities/brand/ui/product-card';
import { Product } from '@/entities/product/model/types';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { Layout } from '@widgets/layout';

interface BrandProductsProps {
  products: Product[];
  brandName: string;
  lng: string;
}

const ProductsBrandView = ({ products, brandName, lng }: BrandProductsProps) => {
  return (
    <Layout>
      <Box as='section' id='brand-products' py={20} bg='white'>
        <Heading as='h3' fontSize='48px' textAlign='center' mb={10}>
          {brandName} Products
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} maxW='container.xl' mx='auto'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} lng={lng} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default ProductsBrandView;
