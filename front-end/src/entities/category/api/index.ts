import { ICategoryResponse } from '@/entities/category/model/types';
import { fetchWrapper } from '@/shared/api/client';
import { baseURL } from '@/shared/api/consts';

export async function fetchCategories(): Promise<ICategoryResponse[]> {
  try {
    const { data }: { data: ICategoryResponse[] } = await fetchWrapper(`${baseURL}/api/subcategories/`, {
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    console.warn('Error fetching subcategories', error);

    return {} as ICategoryResponse[];
  }
}
