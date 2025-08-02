import { IProductResponse } from '@/entities/product/model/types';

export interface ISubCategoryResponse {
  id: number;
  name: string;
  categoryId: number;
  path: string;
}

export interface ICategoryResponse {
  id: number;
  name: string;
  path: string;
  subCategories?: ISubCategoryResponse[];
  products?: IProductResponse[];
}
