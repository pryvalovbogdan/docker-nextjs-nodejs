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
  description?: string | null;
  characteristics?: string | null;
  images?: string[] | null;
  brand?: string | null;
  country?: string | null;
  price?: number | null;
  category: { id: number; name: string };
  subCategory?: { id: number; name: string };
}
