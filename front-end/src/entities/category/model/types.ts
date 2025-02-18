import { IProductResponse } from '@/entities/product/model/types';

export interface ISubCategoryResponse {
  id: number;
  name: string;
  categoryId: number;
}

export interface ICategoryResponse {
  id: number;
  name: string;
  subCategories?: ISubCategoryResponse[];
  products?: IProductResponse[];
}
