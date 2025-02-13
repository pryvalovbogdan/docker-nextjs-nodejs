import { Product, ProductsApiResponse } from '@/entities/product/model/types';
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

export async function fetchProductsOffSet(token: string, page: number = 1, limit: number = 5) {
  try {
    const response = (await fetchWrapper(`/api/products/offset?page=${page}&limit=${limit}`, {
      headers: { Authorization: token },
    })) as ProductsApiResponse;

    return {
      success: true,
      message: response.message,
      products: response.data.products,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Order fetch error:', error);

    return { success: false, message: 'Order fetch failed' };
  }
}
