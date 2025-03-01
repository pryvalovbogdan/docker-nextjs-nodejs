import { ICategoryResponse } from '@/entities/category/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchCategories(isClient?: boolean): Promise<ICategoryResponse[]> {
  try {
    const prefix = !isClient ? baseURL : '';
    const { data }: { data: ICategoryResponse[] } = await fetchWrapper(`${prefix}/api/subcategories/`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.warn('Error fetching subcategories', error);

    return [] as ICategoryResponse[];
  }
}
