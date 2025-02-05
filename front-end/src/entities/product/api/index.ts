import axios from 'axios';

import { Product } from '@/entities/product/model/types';
import { httpGet } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchBrandProducts(name: string): Promise<Product[]> {
  try {
    const { data }: { data: Product[] } = await httpGet(`${baseURL}/api/brand/${name}`);

    return data;
  } catch (error) {
    console.error('Error fetching brand products:', error);

    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const { data }: { data: Product } = await axios.get(`${baseURL}/api/products/${id}`);

    console.log('data', data);

    return data; // Return object with data property to match the return type
  } catch (error) {
    console.log('error', error);

    // Return empty array instead of null to match the return type
    return {} as Product;
  }
}
