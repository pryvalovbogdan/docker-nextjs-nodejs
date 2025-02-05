import { fetchProductById } from '@/entities/product/api';
import ProductView from '@/views/ProductPreview';
import { fallbackLng, languages } from '@i18n/settings';
import { generateMetadata, generateStaticParams } from '@i18n/utils';
import Layout from '@widgets/layout/layout';

export { generateStaticParams, generateMetadata };
export default async function Page({ params }: { params: Promise<{ lng: string; id: string }> }) {
  // eslint-disable-next-line prefer-const
  let { lng, id } = await params;

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const product = await fetchProductById(id);

  console.log('productss', product, id);

  return (
    <Layout>
      <ProductView product={product} lng={lng} />
    </Layout>
  );
}
