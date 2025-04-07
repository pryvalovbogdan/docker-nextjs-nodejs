import { IProductResponse } from '@/entities/product/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchBrandProducts(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/brand/${name}`);

    return data;
  } catch (error) {
    console.error('Error fetching brand products:', error);

    return [];
  }
}

export async function fetchProductById(id: string): Promise<IProductResponse> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper(`${baseURL}/api/products/${id}`);

    return data;
  } catch (error) {
    console.error('Error fetching products by id:', error);

    return { error: true } as IProductResponse;
  }
}

interface IFetchOffsetResp {
  products: IProductResponse[];
  totalPages: number;
  success: boolean;
  message: string;
}
export async function fetchProductsOffSet(
  token: string,
  page: number,
  limit: number,
  isServerCall?: boolean,
): Promise<IFetchOffsetResp> {
  try {
    const prefixUrl = isServerCall ? baseURL : '';
    const response: { message: string; data: { products: IProductResponse[]; totalPages: number } } =
      await fetchWrapper(`${prefixUrl}/api/products/offset?page=${page}&limit=${limit}`);

    return {
      success: true,
      message: response.message,
      products: response.data.products,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Product fetch error:', error);

    return { success: false, message: 'Order fetch failed' } as IFetchOffsetResp;
  }
}

export async function fetchProductByCategoryUi(name: string): Promise<IProductResponse[]> {
  try {
    const encodedName = encodeURIComponent(name);
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`/api/categories/${encodedName}`);

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);

    return [];
  }
}

export async function fetchProductByCategory(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/categories/${name}`);

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);

    return [];
  }
}

export async function fetchProductBySubCategory(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/subcategories/${name}`);

    return data;
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);

    return [];
  }
}

export async function fetchLastAddedProducts(): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/products/last-added`);

    return data;
  } catch (error) {
    console.error('Error fetching last added products:', error);

    return [];
  }
}

export async function fetchSearchProducts(query: string, isServerCall?: boolean): Promise<IProductResponse[]> {
  try {
    const prefixUrl = isServerCall ? baseURL : '';

    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${prefixUrl}/api/products/search/${query}`);

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);

    return [];
  }
}

export async function deleteProduct(token: string, id: string): Promise<{ success: boolean; data: IProductResponse }> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper(`/api/admin/products/${id}`, {
      headers: { Authorization: token },
      method: 'DELETE',
    });

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error('Error deleting products:', error);

    return {
      data: {} as IProductResponse,
      success: false,
    };
  }
}

export async function createProduct(
  formData: any,
  token: string,
): Promise<{ success: boolean; data: IProductResponse }> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper('/api/admin/products', {
      headers: { Authorization: token },
      method: 'POST',
      body: formData,
    });

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error('Error adding products:', error);

    return {
      data: {} as IProductResponse,
      success: false,
    };
  }
}

export async function exportProducts(token: string) {
  try {
    const response = await fetchWrapper('/api/admin/products/export', {
      headers: { Authorization: token },
      responseType: 'arraybuffer',
    });

    const csvString = new TextDecoder('utf-8').decode(response as any);

    return {
      success: true,
      data: csvString,
    };
  } catch (error) {
    console.error('Product export error:', error);

    return { success: false, message: 'Product export failed' };
  }
}

export async function updateProduct(
  formData: any,
  token: string,
  id: number,
): Promise<{ success: boolean; data: IProductResponse }> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper(`/api/admin/products/${id}`, {
      headers: { Authorization: token },
      method: 'POST',
      body: formData,
    });

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error('Error adding products:', error);

    return {
      data: {} as IProductResponse,
      success: false,
    };
  }
}
