import axios from 'axios';

import MainLayout from '@components/MainLayout';
import Brands, { Product } from '@components/pages/Brands';
import { fallbackLng, languages } from '@i18n/settings';

async function fetchProduct<T>(name: string): Promise<T> {
  try {
    const baseURL = process.env.BACKEND_URL || 'http://host.docker.internal:8080';
    // special DNS name host.docker.internal which resolves to the internal IP address used by the host

    const { data } = await axios.get<Product[]>(`${baseURL}/api/brand/${name}`);

    return data;
  } catch (error) {
    console.log('error', error);

    return [] as T;
  }
}

export default async function Page({
  params: { lng, name },
}: {
  params: {
    lng: string;
    name: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const products = await fetchProduct(name);

  console.log('brand name', products, name);

  return (
    <MainLayout>
      <Brands products={products.data || []} />
    </MainLayout>
  );
}
