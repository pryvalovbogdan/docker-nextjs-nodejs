import { IProductResponse } from '@/entities/product/model/types';

export interface ISubCategoryResponse {
  id: number;
  name: string;
  categoryId: number;
  path: string;
  description: string | null;
  title: string;
  heading: string;
}

export interface ICategoryResponse {
  id: number;
  name: string;
  path: string;
  description: string | null;
  title: string;
  heading: string;
  subCategories?: ISubCategoryResponse[];
  products?: IProductResponse[];
}

export interface ISubCategoryResponseReturn {
  success: boolean;
  data: {
    id: number;
    name: string;
    categoryId: number;
    path: string;
    description: string | null;
    title: string;
    heading: string;
    category: string;
  };
}
