import { IProductResponse, ProductsApiResponse } from '@/entities/product/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchBrandProducts(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/brand/${name}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching brand products:', error);

    return [];
  }
}

export async function fetchProductById(id: string): Promise<IProductResponse> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper(`${baseURL}/api/products/${id}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by id:', error);

    return {} as IProductResponse;
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

export async function fetchProductByCategoryUi(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`/api/categories/${name}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);

    return {} as IProductResponse[];
  }
}

export async function fetchProductByCategory(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/categories/${name}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);

    return {} as IProductResponse[];
  }
}

export async function fetchProductBySubCategory(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/subcategories/${name}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);

    return {} as IProductResponse[];
  }
}

export async function fetchLastAddedProducts(): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/products/last-added`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching last added products:', error);

    return [] as IProductResponse[];
  }
}

export async function fetchSearchProducts(query: string, isServerCall?: boolean): Promise<IProductResponse[]> {
  try {
    const prefixUrl = isServerCall ? baseURL : '';

    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${prefixUrl}/api/products/search/${query}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);

    return [] as IProductResponse[];
  }
}
