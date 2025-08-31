import { ICategoryResponse, IExportJsonResponse, IProductResponse } from '@/entities/product/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchBrandProducts(name: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`${baseURL}/api/brand/${name}`, {
      next: { revalidate: 60 },
    });

    return data;
  } catch (error) {
    console.error('Error fetching brand products:', error);

    return [];
  }
}

export async function fetchProductById(id: string, lng: string): Promise<IProductResponse> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper(`${baseURL}/api/products/${id}?lng=${lng}`, {
      next: { revalidate: 60 },
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by id:', error);

    return { error: true } as IProductResponse;
  }
}

export async function fetchProductByIdCache(id: string, lng: string): Promise<IProductResponse> {
  try {
    const { data }: { data: IProductResponse } = await fetchWrapper(`${baseURL}/api/products/${id}?lng=${lng}`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.error('Error fetching products by id:', error);

    return { error: true } as IProductResponse;
  }
}

export interface IFetchOffsetResp {
  products: IProductResponse[];
  totalPages?: number;
  success?: boolean;
  message?: string;
}
export async function fetchProductsOffSet(
  token: string,
  page: number,
  limit: number,
  lng: string,
  isServerCall?: boolean,
): Promise<IFetchOffsetResp> {
  try {
    const prefixUrl = isServerCall ? baseURL : '';
    const response: { message: string; data: { products: IProductResponse[]; totalPages: number } } =
      await fetchWrapper(`${prefixUrl}/api/products/offset?page=${page}&limit=${limit}&lng=${lng}`);

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

export async function fetchProductByCategoryUi(path: string): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(`/api/categories/${path}`);

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);

    return [];
  }
}

export async function fetchProductByCategory(
  path: string,
  lng: string,
  props?: { next: { revalidate: number } },
): Promise<IProductResponse[]> {
  try {
    const { data }: { data: IProductResponse[] } = await fetchWrapper(
      `${baseURL}/api/categories/${path}?lng=${lng}`,
      props,
    );

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
    const queryWithOutSpaces = query.replace(' ', '+');

    const { data }: { data: IProductResponse[] } = await fetchWrapper(
      `${prefixUrl}/api/products/search/${queryWithOutSpaces}`,
      {
        next: { revalidate: 60 },
      },
    );

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

export async function fetchCategoryByPath(
  path: string,
  props?: { next: { revalidate: number } },
): Promise<ICategoryResponse> {
  try {
    const { data }: { data: ICategoryResponse } = await fetchWrapper(`${baseURL}/api/category/${path}`, props);

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);

    return {} as ICategoryResponse;
  }
}

export async function exportProductsJson(token: string): Promise<IExportJsonResponse> {
  try {
    const response = await fetchWrapper('/api/admin/products/export-json', {
      headers: { Authorization: token },
    });

    return { success: true, data: JSON.stringify(response, null, 2) };
  } catch (error) {
    console.error('Product JSON export error:', error);

    return { success: false, message: 'Product JSON export failed' };
  }
}
