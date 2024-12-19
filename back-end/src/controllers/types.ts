export interface ILoginRequestBody {
  username: string;
  password: string;
}

export interface IRegisterRequestBody {
  username: string;
  password: string;
  ip: string;
}

export interface IUpdateNewsRequestBody {
  id: string;
  title?: string;
  description?: string;
  images?: string[];
  date: string;
}

export interface IAddNewsRequestBody {
  title: string;
  description: string;
  images?: string[];
  date: string;
}

export interface IUpdateProductsRequestBody {
  title?: string;
  description?: string;
  images?: string[];
  country?: string;
  manufacture?: string;
  category?: string;
  id: string;
}

export interface IAddNewProductsRequestBody {
  title: string;
  description: string;
  images?: string[];
  date?: string;
  country: string;
  manufacture: string;
  category: string;
}

export interface IUpdateClientsRequestBody {
  name?: string;
  phone?: string;
  date?: string;
  product_id?: string;
  status?: string;
  id: string;
}

export type TMethodValidation = 'login' | 'register' | 'news' | 'product' | 'productId' | 'clients';
