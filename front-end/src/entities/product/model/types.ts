export interface Product {
  id: number;
  title: string;
  description: string;
  characteristics?: string | null;
  images: string[];
  brand?: string;
  country?: string;
  category?: string;
  subCategory?: string;
  price?: number | null;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    totalPages: number;
  };
}

export interface IProductResponse {
  id: number;
  title: string;
  description?: string;
  characteristics?: string;
  images?: string[];
  brand?: string;
  country?: string;
  price?: number;
  title_ru?: string;
  description_ru?: string;
  characteristics_ru?: string;
  category: {
    id: number;
    name: string;
    path: string;
    description: string | null;
    title: string;
    heading: string;
    keywords: string;
    name_ru: string;
    title_ru: string;
  };
  subCategory?: {
    id: number;
    name: string;
    path: string;
    description: string | null;
    title: string;
    heading: string;
    keywords: string;
    name_ru: string;
    title_ru: string;
  };
  error?: boolean;
}

export interface ICategoryResponse {
  id: number;
  name: string;
  path: string;
  name_ru: string;
}

export interface IExportJsonResponse {
  success: boolean;
  data?: string;
  message?: string;
}
