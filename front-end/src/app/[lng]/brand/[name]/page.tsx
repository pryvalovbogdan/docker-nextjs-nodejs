import { fetchBrandProducts } from '@/entities/product/api';
import { generateMetadata, generateStaticParams } from '@i18n/utils';
import Layout from '@widgets/layout/layout';
import { BrandProducts } from '@widgets/prducts-by-brand-list/index';

export { generateStaticParams, generateMetadata };
export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const products = await fetchBrandProducts(name);

  console.log('products', products);

  return (
    <Layout>
      <BrandProducts products={products} brandName={name} />
    </Layout>
  );
}
