import axios from 'axios';

import MainLayout from '@components/MainLayout';
import Brands, { Product } from '@components/pages/Brands';

async function fetchProduct(name: string): Promise<any> {
  try {
    const baseURL = process.env.BACKEND_URL || 'http://host.docker.internal:8080';
    // special DNS name host.docker.internal which resolves to the internal IP address used by the host

    const { data } = await axios.get<Product[]>(`${baseURL}/api/brand/${name}`);

    return data;
  } catch (error) {
    console.log('error', error);

    return { data: [] };
  }
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const products = await fetchProduct(name);

  return (
    <MainLayout>
      <Brands products={products.data} />
    </MainLayout>
  );
}
