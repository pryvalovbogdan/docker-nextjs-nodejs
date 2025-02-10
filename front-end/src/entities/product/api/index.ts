import { Product } from '@/entities/product/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchBrandProducts(name: string): Promise<Product[]> {
  try {
    const { data }: { data: Product[] } = await fetchWrapper(`${baseURL}/api/brand/${name}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching brand products:', error);

    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const { data }: { data: Product } = await fetchWrapper(`${baseURL}/api/products/${id}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by id:', error);

    return {} as Product;
  }
}
