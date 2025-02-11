export interface Product {
  id: number;
  title: string;
  description: string;
  characteristics?: string | null;
  images: string[];
  brand?: string;
  country?: string;
  category?: string;
  price?: number | null;
}
