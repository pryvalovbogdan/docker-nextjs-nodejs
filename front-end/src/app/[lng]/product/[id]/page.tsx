import axios from 'axios';

import MainLayout from '@components/MainLayout';
import { Product } from '@components/pages/Brands';
import ProductView from '@components/pages/ProductPreview';
import { fallbackLng, languages } from '@i18n/settings';

async function fetchProduct(id: string): Promise<any> {
  try {
    const baseURL = process.env.BACKEND_URL || 'http://host.docker.internal:8080';
    // special DNS name host.docker.internal which resolves to the internal IP address used by the hos
    const { data } = await axios.get(`${baseURL}/api/products/${id}`);

    console.log('data', data);

    return data;
  } catch (error) {
    console.log('error', error);

    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ lng: string; id: string }> }) {
  // eslint-disable-next-line prefer-const
  let { lng, id } = await params;

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const product = await fetchProduct(id);

  console.log('productss', product, id);

  return (
    <MainLayout>
      <ProductView product={product.data as Product} lng={lng} />
    </MainLayout>
  );
}
