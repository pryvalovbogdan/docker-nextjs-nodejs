import {
  ICategoryResponse,
  ISubCategoryResponse,
  ISubCategoryResponseReturn,
  ISubcategoryDashboardRow,
} from '@/entities/category/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchCategories(isClient?: boolean): Promise<ICategoryResponse[]> {
  try {
    const prefix = !isClient ? baseURL : '';
    const { data }: { data: ICategoryResponse[] } = await fetchWrapper(`${prefix}/api/subcategories/`);

    return data;
  } catch (error) {
    console.warn('Error fetching subcategories', error);

    return [] as ICategoryResponse[];
  }
}

export interface IFetchCategoryResp {
  categories: ICategoryResponse[];
  totalPages?: number;
  success?: boolean;
  message?: string;
}
export async function fetchCategoriesDashboard(isClient?: boolean): Promise<IFetchCategoryResp> {
  try {
    const prefix = !isClient ? baseURL : '';
    const { data }: { data: ICategoryResponse[] } = await fetchWrapper(`${prefix}/api/subcategories/`);

    return {
      success: true,
      message: '',
      categories: data,
      totalPages: 1,
    };
  } catch (error) {
    console.warn('Error fetching subcategories', error);

    return {} as IFetchCategoryResp;
  }
}

export interface IFetchSubCategoryResp {
  subcategories: ISubcategoryDashboardRow[];
  totalPages?: number;
  success?: boolean;
  message?: string;
}

export async function fetchSubCategoriesDashboard(isClient?: boolean): Promise<IFetchSubCategoryResp> {
  try {
    const prefix = !isClient ? baseURL : '';
    const { data }: { data: ICategoryResponse[] } = await fetchWrapper(`${prefix}/api/subcategories/`);

    const sub = data.reduce<ISubcategoryDashboardRow[]>((acc, item) => {
      item.subCategories?.forEach(sc => {
        acc.push({
          ...sc,
          category: item.name,
          categoryId: item.id,
        } as ISubcategoryDashboardRow);
      });

      return acc;
    }, []);

    return {
      success: true,
      message: '',
      subcategories: sub,
      totalPages: 1,
    };
  } catch (error) {
    console.warn('Error fetching subcategories', error);

    return {} as IFetchSubCategoryResp;
  }
}

export async function createCategory(
  body: {
    name: string;
    path?: string;
    title?: string;
    heading?: string;
    description?: string;
    keywords?: string;
    position?: number;
  },
  token: string,
): Promise<{ success: boolean; data: ICategoryResponse }> {
  try {
    console.log('body', body);
    const { data }: { data: ICategoryResponse } = await fetchWrapper('/api/admin/categories', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error creating category:', error);

    return { success: false, data: {} as ICategoryResponse };
  }
}

export async function updateCategory(
  formData: any,
  token: string,
  id: number,
): Promise<{ success: boolean; data: ICategoryResponse }> {
  try {
    const { data }: { data: ICategoryResponse } = await fetchWrapper(`/api/admin/categories/${id}`, {
      method: 'POST',
      headers: { Authorization: token },
      body: formData,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error updating category:', error);

    return { success: false, data: {} as ICategoryResponse };
  }
}

export async function createSubCategory(
  body: {
    name: string;
    path?: string;
    title?: string;
    heading?: string;
    description?: string;
    keywords?: string;
    position?: number;
  },
  token: string,
): Promise<ISubCategoryResponseReturn> {
  try {
    const { data }: { data: ISubCategoryResponse } = await fetchWrapper('/api/admin/subcategories', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return { success: true, data: { ...data, categoryId: (data as any).category.id, category: '' } };
  } catch (error) {
    console.error('Error creating category:', error);

    return { success: false, data: {} } as ISubCategoryResponseReturn;
  }
}

export async function updateSubCategory(formData: any, token: string, id: number): Promise<ISubCategoryResponseReturn> {
  try {
    const { data }: { data: ISubCategoryResponse } = await fetchWrapper(`/api/admin/subcategories/${id}`, {
      method: 'POST',
      headers: { Authorization: token },
      body: formData,
    });

    return { success: true, data: { ...data, categoryId: (data as any).category.id, category: '' } };
  } catch (error) {
    console.error('Error updating category:', error);

    return { success: false, data: {} } as ISubCategoryResponseReturn;
  }
}

export async function deleteCategory(token: string, id: string): Promise<{ success: boolean; data: any }> {
  try {
    const data = await fetchWrapper(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    return {
      data,
      success: true,
    };
  } catch (e) {
    console.error('Error deleting subcategory:', e);

    return { success: false, data: {} };
  }
}

export async function deleteSubCategory(token: string, id: string): Promise<{ success: boolean; data: any }> {
  try {
    const data = await fetchWrapper(`/api/admin/subcategories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    return { success: true, data };
  } catch (e) {
    console.error('Error deleting subcategory:', e);

    return { success: false, data: {} };
  }
}
